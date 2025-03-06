import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Auth "canister:auth";
import Forms "canister:forms";

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

  // Forms

  public shared ({ caller }) func createForm() : async Response<Text> {
    await Forms.createForm(caller);
  };

  public composite query ({ caller }) func getOwnedForms() : async Response<[Forms.Form]> {
    await Forms.getOwnedForms(caller);
  };

  public composite query ({ caller }) func getForm(formId : Text) : async Response<Forms.Form> {
    await Forms.getForm(caller, formId);
  };

  public shared ({ caller }) func updateFormMetadata(formId : Text, newMetadata : Forms.FormMetadata) : async Response<()> {
    await Forms.updateFormMetadata(caller, formId, newMetadata);
  };

  public shared ({ caller }) func setFormQuestions(formId : Text, questions : [Forms.Question]) : async Response<()> {
    await Forms.setFormQuestions(caller, formId, questions);
  };

  public shared ({ caller }) func addFormResponse(formId : Text, answers : [Forms.AnswerType]) : async Response<()> {
    await Forms.addFormResponse(caller, formId, answers);
  };

  public composite query ({ caller }) func getFormResponseSummary(formId : Text) : async Response<(Nat, [Forms.FormResponseSummary])> {
    await Forms.getFormResponseSummary(caller, formId);
  };

  public shared ({ caller }) func changeFormPublish(formId : Text) : async Response<Bool> {
    Debug.print("Chipi Chipi Chapa Chapa");
    await Forms.changeFormPublish(caller, formId);
  };
};
