import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Int64 "mo:base/Int64";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Auth "canister:auth";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";

actor class Forms() {
  type Time = Time.Time;
  type Result<T, E> = Result.Result<T, E>;
  type Response<T> = Result<T, Text>;

  // These are metadatas that can be updated
  // unlike ids and createdAt
  public type FormMetadata = {
    deadline : ?Time;
    published : Bool;
    minAge : ?Nat;
    maxAge : ?Nat;
    country : ?Text;
    city : ?Text;
    occupation : ?Text;
    title : Text;
    description : Text;
    categories : [Text];
  };

  public type Form = {
    id : Text;
    creator : Principal;
    createdAt : Time;
    metadata : FormMetadata;
    questions : [Question];
    responses : [FormResponse];
  };

  public type FormPreview = {
    id : Text;
    creator : Principal;
    createdAt : Time;
    metadata : FormMetadata;
  };

  public type MultipleChoiceQuestion = {
    options : [Text];
  };

  public type CheckboxQuestion = {
    options : [Text];
  };

  public type RangeQuestion = {
    minRange : Nat;
    maxRange : Nat;
  };

  public type QuestionType = {
    #Essay;
    #MultipleChoice : MultipleChoiceQuestion;
    #Checkbox : CheckboxQuestion;
    #Range : RangeQuestion;
  };

  public type Question = {
    formId : Text;
    questionTitle : Text;
    questionType : QuestionType;
    isRequired : Bool;
  };

  public type AnswerType = {
    #Essay : ?Text;
    #MultipleChoice : ?Nat;
    #Checkbox : [Nat];
    #Range : ?Int64;
  };

  public type FormResponse = {
    formId : Text;
    answerer : Principal;
    answers : [AnswerType];
    submitTime : Time;
  };

  let forms = TrieMap.TrieMap<Text, Form>(Text.equal, Text.hash);

  public shared func createForm(caller : Principal) : async Response<Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };
    // if not verified
    let userResponse = await Auth.getUser(caller);
    switch (userResponse) {
      case (#ok(_)) {};
      case (#err(error)) { return #err(error) };
    };

    // ENDVALIDATION
    let newForm : Form = {
      id = UUID.toText(await Source.Source().new());
      createdAt = Time.now();
      creator = caller;
      metadata = {
        published = false;
        title = "Untitled Survey";
        deadline = null;
        minAge = null;
        maxAge = null;
        country = null;
        city = null;
        occupation = null;
        description = "";
        categories = [];
      };
      questions = [];
      responses = [];
    };

    forms.put(newForm.id, newForm);
    return #ok(newForm.id);
  };

  public composite query func getOwnedForms(caller : Principal) : async Response<[Form]> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };
    let userResponse = await Auth.getUser(caller);
    switch (userResponse) {
      case (#ok(_)) {};
      case (#err(error)) {
        return #err(error);
      };
    };

    // ENDVALIDATION
    var ownedForms : [Form] = [];
    for ((_, form) in forms.entries()) {
      if (form.creator == caller) {
        ownedForms := Array.append(ownedForms, [form]);
      };
    };

    return #ok(ownedForms);
  };

  public shared query func getForm(caller : Principal, formId : Text) : async Response<Form> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let form = forms.get(formId);
    switch (form) {
      case (null) { #err("Form not found") };
      case (?f) { #ok(f) };
    };
  };

  public shared func updateFormMetadata(caller : Principal, formId : Text, newMetadata : FormMetadata) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (f.creator != caller) {
          return #err("Unauthorized");
        };

        let newForm : Form = {
          id = formId;
          creator = f.creator;
          createdAt = f.createdAt;
          metadata = newMetadata;
          questions = f.questions;
          responses = f.responses;
        };

        // TODO: metadata validations
        if (f.metadata.published and not newMetadata.published) {
          return #err("Form can't be unpublished");
        };
        if (f.metadata.published and f.metadata.deadline != newMetadata.deadline) {
          return #err("Form deadline can't be changed after deadline");
        };
        if (newMetadata.published and Option.isNull(f.metadata.deadline)) {
          return #err("Form deadline must be defined before publish");
        };

        forms.put(formId, newForm);

        return #ok();
      };
      case (_) { return #err("Form not found") };
    };
  };

  public shared func setFormQuestions(
    caller : Principal,
    formId : Text,
    questions : [Question],
  ) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let formOwnership = validateFormOwnership(formId, caller);
    switch (formOwnership) {
      case (#ok(form)) {
        let newForm : Form = {
          id = form.id;
          metadata = form.metadata;
          creator = form.creator;
          createdAt = form.createdAt;
          questions = questions;
          responses = form.responses;
        };

        forms.put(form.id, newForm);
        return #ok();
      };
      case (#err(error)) { return #err(error) };
    };
  };

  public shared func addFormResponse(
    caller : Principal,
    formId : Text,
    answers : [AnswerType],
  ) : async Response<()> {
    // kalau questionnya g required n ga dijawab, masukin null aja di answernya
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (not f.metadata.published) {
          return #err("Form is not yet published");
        };

        // jawabanny gabole diatas deadline
        let submitTime : Time = Time.now();
        let deadline : ?Time = f.metadata.deadline;
        switch (deadline) {
          case (?d) {
            if (submitTime > d) {
              return #err("Form is already closed");
            };
          };
          case (null) {};
        };

        // questions.length harus sama dg answers.length
        if (f.questions.size() != answers.size()) {
          return #err("Invalid response format: question and answer count are different");
        };

        // answerType === questionType
        // if required, answer might not be null
        for (i in Iter.range(0, answers.size() - 1)) {
          let question = f.questions[i];
          let answer = answers[i];

          switch (question.questionType, answer) {
            case (#Essay, #Essay(?_)) {};
            case (#MultipleChoice(_), #MultipleChoice(?_)) {};
            case (#Checkbox(_), #Checkbox(_)) {};
            case (#Range(_), #Range(?_)) {};
            case _ {
              return #err("Invalid answer type for question " # debug_show (i));
            };
          };

          if (question.isRequired) {
            switch (answer) {
              case (#Essay(null)) {
                return #err("Question " # debug_show (i) # " is required");
              };
              case (#MultipleChoice(null)) {
                return #err("Question " # debug_show (i) # " is required");
              };
              case (#Range(null)) {
                return #err("Question " # debug_show (i) # " is required");
              };
              case _ {};
            };
          };
        };

        let newForm : Form = {
          id = f.id;
          metadata = f.metadata;
          creator = f.creator;
          createdAt = f.createdAt;
          questions = f.questions;
          responses = Array.append(f.responses, [{
            formId = formId;
            answerer = caller;
            answers = answers;
            submitTime = submitTime
          }]);
        };
        forms.put(formId, newForm);

        return #ok();
      };
      case (null) {
        return #err("Form not found");
      };
    };
  };

  private func validateFormOwnership(formId : Text, caller : Principal) : Response<Form> {
    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (f.creator != caller) {
          return #err("Unauthorized");
        };

        #ok(f);
      };
      case (_) { return #err("Form not found") };
    };
  };
};
