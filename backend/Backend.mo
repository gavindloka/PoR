import Result "mo:base/Result";
import Auth "canister:auth";
import Forms "canister:forms";
import Principal "mo:base/Principal";

actor class Backend() {
  type Result<T, E> = Result.Result<T, E>;

  // the type we return to the front end will be
  // error -> Text
  // ok -> T
  type Response<T> = Result<T, Text>;

  public composite query ({ caller }) func getUser() : async Response<Auth.User> {
    await Auth.getUser(caller);
  };

  public shared ({ caller }) func verify(image : Blob) : async Response<()> {
    await Auth.verify(caller, image);
  };

  public shared ({ caller }) func updateUser(name : ?Text, age : ?Nat, gender : ?Text, country : ?Text, city : ?Text, occupation : ?Text) : async Response<()> {
    await Auth.updateUser(caller, name, age, gender, country, city, occupation);
  };

  // FORMS
  public shared ({ caller }) func createForm() : async Response<Text> {
    await Forms.createForm(caller);
  };

  public composite query ({ caller }) func getOwnedForms() : async Response<[Forms.Form]> {
    await Forms.getOwnedForms(caller);
  };

  public composite query ({ caller }) func getForm(formId : Text) : async Response<Forms.Form> {
    await Forms.getForm(caller, formId);
  };

  public shared ({ caller }) func updateFormTitle(formId : Text, newTitle : Text) : async Response<()> {
    await Forms.updateFormTitle(caller, formId, newTitle);
  };

  public shared ({ caller }) func updateFormSettings(
    formId : Text,
    minAge : ?Nat,
    maxAge : ?Nat,
    country : ?Text,
    city : ?Text,
    occupation : ?Text,
  ) : async Response<()> {
    await Forms.updateFormSettings(caller, formId, minAge, maxAge, country, city, occupation);
  };

  public shared ({ caller }) func addQuestionToForm(
    formId : Text,
    questionTypeText : Text,
  ) : async Response<()> {
    await Forms.addQuestionToForm(caller, formId, questionTypeText);
  };

  public composite query ({ caller }) func getFormQuestions(formId : Text) : async Response<[Forms.Question]> {
    await Forms.getFormQuestions(caller, formId);
  };

  public shared ({ caller }) func updateQuestionText(questionId : Text, newText : Text) : async Response<()> {
    await Forms.updateQuestionText(caller, questionId, newText);
  };

  public shared ({ caller }) func updateQuestionType(questionId : Text, newQuestionTypeText : Text) : async Response<()> {
    await Forms.updateQuestionType(caller, questionId, newQuestionTypeText);
  };

  public shared ({ caller }) func updateQuestionRequirement(questionId : Text, newRequired : Bool) : async Response<()> {
    await Forms.updateQuestionRequirement(caller, questionId, newRequired);
  };

  public shared ({ caller }) func deleteQuestion(questionId : Text) : async Response<()> {
    await Forms.deleteQuestion(caller, questionId);
  };

  public shared ({ caller }) func addQuestionOption(questionId : Text) : async Response<()> {
    await Forms.addQuestionOption(caller, questionId);
  };

  public composite query ({ caller }) func getQuestionOptions(questionId : Text) : async Response<[Forms.QuestionOption]> {
    await Forms.getQuestionOptions(caller, questionId);
  };

  public shared ({ caller }) func updateQuestionOption(
    questionOptionId : Text,
    newText : Text,
  ) : async Response<()> {
    await Forms.updateQuestionOption(caller, questionOptionId, newText);
  };

  public shared ({ caller }) func deleteQuestionOption(questionOptionId : Text) : async Response<()> {
    await Forms.deleteQuestionOption(caller, questionOptionId);
  };
};
