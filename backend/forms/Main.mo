import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
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
    // TODO: can't change deadline after publish
    deadline : ?Time;
    // TODO: can't unpublish a survey
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
    // TODO: add a max-question limit
    questions : [Question];
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

        // TODO: metadata validations according to the TODO above
        let newForm : Form = {
          id = formId;
          creator = f.creator;
          createdAt = f.createdAt;
          metadata = newMetadata;
          questions = f.questions;
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
        };

        forms.put(form.id, newForm);
        return #ok();
      };
      case (#err(error)) { return #err(error) };
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
