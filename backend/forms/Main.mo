import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Float "mo:base/Float";
import Blob "mo:base/Blob";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Auth "canister:auth";
import ICPIndex "canister:icp_index_canister";
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
    maxRespondent : Nat;
    maxRewardPool : Nat;
    rewardAmount : Nat;

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
    #Range : ?Nat;
  };

  public type FormResponse = {
    formId : Text;
    answerer : Principal;
    answers : [AnswerType];
    submitTime : Time;
  };

  public type SummaryType = {
    #Essay : [Text];
    #FrequencyArray : [Nat];
    #FrequencyMap : [(Nat, Nat)];
  };

  public type FormResponseSummary = {
    question : Question;
    summary : SummaryType;
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
        maxRespondent = 0;
        maxRewardPool = 0;
        rewardAmount = 0;
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
        if (newMetadata.published and Option.isNull(newMetadata.deadline)) {
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

  // TODO: verify kalo user cm isi sekali
  public shared func addFormResponse(
    caller : Principal,
    formId : Text,
    answers : [AnswerType],
  ) : async Response<()> {
    // kalau questionnya g required n ga dijawab, masukin null aja di answernya
    // question yg tipenya multiple choice, kasih index dr jawabanny aj
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

    let form = forms.get(formId);
    switch (form) {
      case (?f) {
        if (not f.metadata.published) {
          return #err("Form is not yet published");
        };

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
              case (#Checkbox(choices)) {
                if (choices.size() == 0) {
                  return #err("Question " # debug_show (i) # " is required");
                };
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
          responses = Array.append(f.responses, [{ formId = formId; answerer = caller; answers = answers; submitTime = submitTime }]);
        };
        forms.put(formId, newForm);

        return #ok();
      };
      case (null) {
        return #err("Form not found");
      };
    };
  };

  public composite query func getFormResponseSummary(caller : Principal, formId : Text) : async Response<[FormResponseSummary]> {
    if (Principal.isAnonymous(caller)) {
      return #err("Unauthorized");
    };

    let formOwnership = validateFormOwnership(formId, caller);
    switch (formOwnership) {
      case (#ok(form)) {
        let responses = form.responses;
        let questions = form.questions;

        // initialize summary array
        let summaries : [var FormResponseSummary] = Array.thaw<FormResponseSummary>(
          Array.tabulate<FormResponseSummary>(
            questions.size(),
            func(i) {
              let question = questions[i];

              let summary : SummaryType = switch (question.questionType) {
                case (#Essay) { #Essay([]) };
                case (#MultipleChoice(question)) {
                  #FrequencyArray(Array.tabulate<Nat>(question.options.size(), func _ = 0));
                };
                case (#Checkbox(question)) {
                  #FrequencyArray(Array.tabulate<Nat>(question.options.size(), func _ = 0));
                };
                case (#Range(question)) {
                  #FrequencyMap(
                    Array.tabulate<(Nat, Nat)>(
                      question.maxRange - question.minRange + 1,
                      func(i) {
                        ((i + question.minRange), 0)
                      },
                    )
                  );
                };
              };

              {
                question = question;
                summary = summary;
              };
            },
          )
        );

        // fill the summary
        for (response in responses.vals()) {
          let answers = response.answers;

          for (i in Iter.range(0, answers.size())) {
            switch (answers[i]) {
              case (#Essay(answer)) {
                // unpack null
                switch (answer) {
                  case (?a) {
                    // if not null, add to summary
                    switch (summaries[i].summary) {
                      case (#Essay(arr)) {
                        summaries[i] := {
                          question = summaries[i].question;
                          summary = #Essay(Array.append(arr, [a]));
                        };
                      };
                      case (_) {};
                    };
                  };
                  case (null) {};
                };
              };
              case (#MultipleChoice(answer)) {
                // unpack null
                switch (answer) {
                  case (?a) {
                    // if not null, add to summary
                    switch (summaries[i].summary) {
                      case (#FrequencyArray(arr)) {
                        summaries[i] := {
                          question = summaries[i].question;
                          summary = #FrequencyArray(Array.mapEntries<Nat, Nat>(arr, func(x, index) {
                            if(index == a) x + 1 else x;
                          }));
                        };
                      };
                      case (_) {};
                    };
                  };
                  case (null) {};
                };
              };
              case (#Checkbox(answer)) {
                for (choice in answer.vals()) {
                  switch (summaries[i].summary) {
                    case (#FrequencyArray(arr)) {
                      summaries[i] := {
                          question = summaries[i].question;
                          summary = #FrequencyArray(Array.mapEntries<Nat, Nat>(arr, func(x, index) {
                            if(index == choice) x + 1 else x;
                          }));
                        };
                    };
                    case (_) {};
                  };
                };
              };
              case (#Range(answer)) {
                // unpack null
                switch (answer) {
                  case (?a) {
                    // if not null, add to summary
                    switch (summaries[i].summary) {
                      case (#FrequencyMap(map)) {
                        summaries[i] := {
                          question = summaries[i].question;
                          summary = #FrequencyMap(Array.map<(Nat, Nat), (Nat, Nat)>(map, func((key, count)) {
                            if(key == a) (key, count + 1) else (key, count);
                          }));
                        };
                      };
                      case (_) {};
                    };
                  };
                  case (null) {};
                };
              };
            };
          };
        };
        return #ok(Array.freeze(summaries));
      };
      case (#err(error)) {
        return #err(error);
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

  public func hashMemo(formId: Text) : async Blob {
    var hash : Nat = 0;
    let prime : Nat = 31;
    let modValue : Nat = 2 ** 64;

    for (c in Text.toIter(formId)) {  
        hash := (hash * prime + Nat32.toNat(Char.toNat32(c))) % modValue;
    };

        // Convert Nat to byte array (Uint8Array equivalent)
    var bytes = Array.init<Nat8>(8, 0); 
    var temp = hash;
    for (i in Iter.range(0, 7)) {
        bytes[i] := Nat8.fromNat(temp % 256);  // Use `mod 256` instead of `& 0xFF`
        temp := temp / 256;  // Use integer division instead of `>>`
    };

    Blob.fromArray(Array.freeze(bytes));
  };

public shared func changeFormPublish(caller: Principal, formId: Text) : async Response<Bool> {
    switch (forms.get(formId)) {
        case (?form) {  
            try {
                let results = await ICPIndex.get_account_transactions({
                    max_results = 1;
                    start = null;
                    account = {
                        owner = caller;
                        subaccount = null;
                    };
                });

                switch (results) {
                    case (#Ok(txData)) {
                        if (txData.transactions.size() == 0) {
                            return #err("No transactions found");
                        };

                        let latestTx = txData.transactions[0];

                        switch (latestTx.transaction.operation) {
                            case (#Transfer(transferData)) {
                                switch (latestTx.transaction.icrc1_memo) {
                                    case (?memoBytes) {
                                        let memoHash = memoBytes;
                                        let expectedHash = await hashMemo(formId);

                                        if (memoHash == expectedHash) {
                                            let newForm : Form = {
                                                id = form.id;
                                                createdAt = form.createdAt;
                                                creator = form.creator;
                                                metadata = {
                                                    published = true;
                                                    title = form.metadata.title;
                                                    deadline = form.metadata.deadline;
                                                    minAge = form.metadata.minAge;
                                                    maxAge = form.metadata.maxAge;
                                                    country = form.metadata.country;
                                                    city = form.metadata.city;
                                                    occupation = form.metadata.occupation;
                                                    description = form.metadata.description;
                                                    categories = form.metadata.categories;
                                                    maxRespondent = form.metadata.maxRespondent;
                                                    maxRewardPool = form.metadata.maxRewardPool;
                                                    rewardAmount = form.metadata.rewardAmount;
                                                };
                                                questions = form.questions;
                                                responses = form.responses;
                                            };

                                            forms.put(formId, newForm);
                                            return #ok(true); // Payment matches the form ID
                                        } else {
                                            return #err("Payment memo does not match form ID");
                                        };
                                    };
                                    case (null) {
                                        return #err("No memo found in transaction");
                                    };
                                };
                            };
                            case (_) {
                                return #err("Latest transaction is not a payment");
                            };
                        };
                    };
                    case (#Err(err)) {
                        return #err("Failed to get transactions: " # err.message);
                    };
                };
            }catch (error) {
                return #err("Error retrieving transactions");
            };
        };
        case (null) {
            return #err("Form not found");
        };
    };
  };





};
