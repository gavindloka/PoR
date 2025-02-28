import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Auth "canister:auth";
import Option "mo:base/Option";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";

actor class Forms() {
  type Time = Time.Time;
  type Result<T, E> = Result.Result<T, E>;
  type Response<T> = Result<T, Text>;

  public type Form = {
    id : Text;
    title : Text;
    creatorId : Text;
    createdAt : Time;
    deadline : ?Time;
    minAge : ?Nat;
    maxAge : ?Nat;
    country : ?Text;
    city : ?Text;
    occupation : ?Text;
    questionIds : [Text];
  };

  public type Question = {
    id : Text;
    formId : Text;
    questionText : Text;
    questionType : QuestionType;
    isRequired : Bool;
    minRange : ?Nat; // for range type question
    maxRange : ?Nat;
    optionIds : ?[Text];
  };

  public type QuestionOption = {
    id : Text;
    questionId : Text;
    optionText : Text;
  };

  let DEFAULT_QUESTION_MIN_RANGE = 1;
  let DEFAULT_QUESTION_MAX_RANGE = 5;

  public type QuestionType = {
    #Essay;
    #MultipleChoice;
    #Checkbox;
    #Range;
    #SectionTitle;
  };

  private func questionTypeFromText(text : Text) : ?QuestionType {
    switch (text) {
      case ("essay") { ?#Essay };
      case ("multipleChoice") { ?#MultipleChoice };
      case ("checkbox") { ?#Checkbox };
      case ("range") { ?#Range };
      case ("sectionTitle") { ?#SectionTitle };
      case (_) { null };
    };
  };

  let forms = TrieMap.TrieMap<Text, Form>(Text.equal, Text.hash);
  let questions = TrieMap.TrieMap<Text, Question>(Text.equal, Text.hash);
  let questionOptions = TrieMap.TrieMap<Text, QuestionOption>(Text.equal, Text.hash);
  

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
      title = "";
      creatorId = Principal.toText(caller);
      createdAt = Time.now();
      deadline = null;
      minAge = null;
      maxAge = null;
      country = null;
      city = null;
      occupation = null;
      questionIds = [];
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

    let creatorId = Principal.toText(caller);

    var ownedForms : [Form] = [];
    for ((_, form) in forms.entries()) {
      if (form.creatorId == creatorId) {
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

  public shared func updateFormTitle(caller : Principal, formId : Text, newTitle : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (f.creatorId != Principal.toText(caller)) {
          return #err("Unauthorized");
        };

        let newForm : Form = {
          id = formId;
          title = newTitle;
          creatorId = f.creatorId;
          createdAt = f.createdAt;
          deadline = f.deadline;
          minAge = f.minAge;
          maxAge = f.maxAge;
          country = f.country;
          city = f.city;
          occupation = f.occupation;
          questionIds = f.questionIds;
        };

        forms.put(formId, newForm);

        return #ok();
      };
      case (_) { return #err("Form not found") };
    };
  };

  public shared func updateFormSettings(
    caller : Principal,
    formId : Text,
    minAge : ?Nat,
    maxAge : ?Nat,
    country : ?Text,
    city : ?Text,
    occupation : ?Text,
  ) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (f.creatorId != Principal.toText(caller)) {
          return #err("Unauthorized");
        };

        let newForm : Form = {
          id = formId;
          title = f.title;
          creatorId = f.creatorId;
          createdAt = f.createdAt;
          deadline = f.deadline;
          minAge = minAge;
          maxAge = maxAge;
          country = country;
          city = city;
          occupation = occupation;
          questionIds = f.questionIds;
        };

        forms.put(formId, newForm);

        return #ok();
      };
      case (_) { return #err("Form not found") };
    };

  };

  public shared func addQuestionToForm(
    caller : Principal,
    formId : Text,
    questionTypeText : Text,
  ) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let formOwnership = validateFormOwnership(formId, caller);
    switch (formOwnership) {
      case (#ok(form)) {

        let questionType = questionTypeFromText(questionTypeText);
        switch (questionType) {
          case (?qt) {
            let newQuestion : Question = {
              id = UUID.toText(await Source.Source().new());
              formId = formId;
              questionText = "";
              questionType = qt;
              isRequired = true;
              minRange = if (qt == #Range) ?DEFAULT_QUESTION_MIN_RANGE else null;
              maxRange = if (qt == #Range) ?DEFAULT_QUESTION_MAX_RANGE else null;
              optionIds = if (qt == #MultipleChoice or qt == #Checkbox) ?[] else null;
            };

            questions.put(newQuestion.id, newQuestion);

            let newForm : Form = {
              id = form.id;
              title = form.title;
              creatorId = form.creatorId;
              createdAt = form.createdAt;
              deadline = form.deadline;
              minAge = form.minAge;
              maxAge = form.maxAge;
              country = form.country;
              city = form.city;
              occupation = form.occupation;
              questionIds = Array.append(form.questionIds, [newQuestion.id]);
            };

            forms.put(form.id, newForm);
            return #ok();
          };
          case (_) { return #err("Invalid question type") };
        };
      };
      case (#err(error)) { return #err(error) };
    };
  };

  public composite query func getFormQuestions(caller : Principal, formId : Text) : async Response<[Question]> {
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

    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {

        var formQuestions : [Question] = [];
        for (questionId in f.questionIds.vals()) {
          switch (questions.get(questionId)) {
            case (?q) { formQuestions := Array.append(formQuestions, [q]) };
            case (_) {};
          };
        };

        return #ok(formQuestions);
      };
      case (_) { return #err("Form not found") };
    };
  };

  public shared func updateQuestionText(caller : Principal, questionId : Text, newText : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let question : ?Question = questions.get(questionId);
    switch (question) {
      case (?q) {
        let formOwnership = validateFormOwnership(q.formId, caller);
        switch (formOwnership) {
          case (#ok(_)) {};
          case (#err(error)) { return #err(error) };
        };

        let newQuestion : Question = {
          id = questionId;
          formId = q.formId;
          questionText = newText;
          questionType = q.questionType;
          isRequired = q.isRequired;
          minRange = q.minRange;
          maxRange = q.maxRange;
          optionIds = q.optionIds;
        };

        questions.put(questionId, newQuestion);

        return #ok();
      };
      case (_) { return #err("Question not found") };
    };
  };

  public shared func updateQuestionType(caller : Principal, questionId : Text, newQuestionTypeText : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let question : ?Question = questions.get(questionId);
    switch (question) {
      case (?q) {
        let formOwnership = validateFormOwnership(q.formId, caller);
        switch (formOwnership) {
          case (#ok(_)) {};
          case (#err(error)) { return #err(error) };
        };

        let newQuestionType : ?QuestionType = questionTypeFromText(newQuestionTypeText);
        switch (newQuestionType) {
          case (?qt) {
            let oldQuestionType = q.questionType;
            let newQuestion : Question = {
              id = questionId;
              formId = q.formId;
              questionText = q.questionText;
              questionType = qt;
              isRequired = q.isRequired;
              minRange = if (qt == #Range) ?DEFAULT_QUESTION_MIN_RANGE else null;
              maxRange = if (qt == #Range) ?DEFAULT_QUESTION_MAX_RANGE else null;
              optionIds = if (qt == #MultipleChoice or qt == #Checkbox) ?[] else null;
            };

            // clear question options if old type is checkbox/range, and new type is others
            if (
              (oldQuestionType == #MultipleChoice or oldQuestionType == #Checkbox) and newQuestion.optionIds == null
            ) {
              for ((key, option) in questionOptions.entries()) {
                if (option.questionId == questionId) {
                  ignore questionOptions.remove(key);
                };
              };
            };

            questions.put(questionId, newQuestion);

            return #ok();
          };
          case (_) { return #err("Invalid question type") };
        };
      };
      case (_) { return #err("Question not found") };
    };

  };

  public shared func updateQuestionRequirement(caller : Principal, questionId : Text, newRequired : Bool) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let question : ?Question = questions.get(questionId);
    switch (question) {
      case (?q) {
        let formOwnership = validateFormOwnership(q.formId, caller);
        switch (formOwnership) {
          case (#ok(_)) {};
          case (#err(error)) { return #err(error) };
        };

        let newQuestion : Question = {
          id = questionId;
          formId = q.formId;
          questionText = q.questionText;
          questionType = q.questionType;
          isRequired = newRequired;
          minRange = q.minRange;
          maxRange = q.maxRange;
          optionIds = q.optionIds;
        };

        questions.put(questionId, newQuestion);

        return #ok();
      };
      case (_) { return #err("Question not found") };
    };
  };

  public shared func deleteQuestion(caller : Principal, questionId : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let question : ?Question = questions.get(questionId);
    switch (question) {
      case (?q) {
        let formOwnership : Response<Form> = validateFormOwnership(q.formId, caller);
        switch (formOwnership) {
          case (#ok(_)) {};
          case (#err(error)) { return #err(error) };
        };

        ignore questions.remove(questionId);

        // clear question options if type is checkbox/range
        if (
          q.questionType == #MultipleChoice or q.questionType == #Checkbox
        ) {
          for ((key, option) in questionOptions.entries()) {
            if (option.questionId == questionId) {
              ignore questionOptions.remove(key);
            };
          };
        };

        return #ok();
      };
      case (_) { return #err("Question not found") };
    };

  };

  public shared func addQuestionOption(caller : Principal, questionId : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let question : ?Question = questions.get(questionId);
    switch (question) {
      case (?q) {
        let formOwnership = validateFormOwnership(q.formId, caller);
        switch (formOwnership) {
          case (#ok(_)) {};
          case (#err(error)) { return #err(error) };
        };

        switch (q.questionType) {
          case (#MultipleChoice) {
            let newOption : QuestionOption = {
              id = UUID.toText(await Source.Source().new());
              questionId = questionId;
              optionText = "";
            };

            questionOptions.put(newOption.id, newOption);

            let newQuestion : Question = {
              id = questionId;
              formId = q.formId;
              questionText = q.questionText;
              questionType = q.questionType;
              isRequired = q.isRequired;
              minRange = q.minRange;
              maxRange = q.maxRange;
              optionIds = ?Array.append(Option.get<[Text]>(q.optionIds, []), [newOption.id]);
            };

            questions.put(questionId, newQuestion);
            #ok();
          };
          case (#Checkbox) {
            let newOption : QuestionOption = {
              id = UUID.toText(await Source.Source().new());
              questionId = questionId;
              optionText = "";
            };

            questionOptions.put(newOption.id, newOption);

            let newQuestion : Question = {
              id = questionId;
              formId = q.formId;
              questionText = q.questionText;
              questionType = q.questionType;
              isRequired = q.isRequired;
              minRange = q.minRange;
              maxRange = q.maxRange;
              optionIds = ?Array.append(Option.get<[Text]>(q.optionIds, []), [newOption.id]);
            };

            questions.put(questionId, newQuestion);
            #ok();
          };
          case (_) { #err("Invalid question type for this operation") };
        };
      };
      case (_) { return #err("Question not found") };
    };
  };

  public composite query func getQuestionOptions(caller : Principal, questionId : Text) : async Response<[QuestionOption]> {
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

    let question = questions.get(questionId);
    switch (question) {
      case (?q) {

        var options : [QuestionOption] = [];
        var optionIds : ?[Text] = q.optionIds;
        switch (optionIds) {
          case (?ids) {
            for (questionOptionId in ids.vals()) {
              switch (questionOptions.get(questionOptionId)) {
                case (?opt) {
                  options := Array.append(options, [opt]);
                };
                case (_) {};
              };
            };
          };
          case (_) {};
        };
        return #ok(options);
      };
      case (_) { return #err("Question not found") };
    };
  };

  public shared func updateQuestionOption(
    caller : Principal,
    questionOptionId : Text,
    newText : Text,
  ) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let questionOption : ?QuestionOption = questionOptions.get(questionOptionId);
    switch (questionOption) {
      case (?qo) {

        let question : ?Question = questions.get(qo.questionId);
        switch (question) {
          case (?q) {
            let formOwnership = validateFormOwnership(q.formId, caller);
            switch (formOwnership) {
              case (#ok(_)) {};
              case (#err(error)) { return #err(error) };
            };

            let newOption : QuestionOption = {
              id = questionOptionId;
              questionId = qo.questionId;
              optionText = newText;
            };

            questionOptions.put(questionOptionId, newOption);

            return #ok();
          };
          case (_) { return #err("Question not found") };
        };
      };
      case (_) { return #err("Question option not found") };
    };

  };

  public shared func deleteQuestionOption(caller : Principal, questionOptionId : Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let questionOption : ?QuestionOption = questionOptions.get(questionOptionId);
    switch (questionOption) {
      case (?qo) {

        let question : ?Question = questions.get(qo.questionId);
        switch (question) {
          case (?q) {

            let formOwnership : Response<Form> = validateFormOwnership(q.formId, caller);
            switch (formOwnership) {
              case (#ok(_)) {
                ignore questionOptions.remove(questionOptionId);
                return #ok();
              };
              case (#err(error)) { return #err(error) };
            };

          };
          case (null) {
            return #err("Question not found");
          };
        };
      };
      case (null) { return #err("Question option not found") };
    };
  };

  private func validateFormOwnership(formId : Text, caller : Principal) : Response<Form> {
    let form : ?Form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (f.creatorId != Principal.toText(caller)) {
          return #err("Unauthorized");
        };

        #ok(f);
      };
      case (_) { return #err("Form not found") };
    };
  };
};
