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
import Debug "mo:base/Debug";
import Auth "canister:auth";
import Ledger "canister:icp_ledger_canister_backend";
import ICPIndex "canister:icp_index_canister";
import Int "mo:base/Int";
import None "mo:base/None";
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
    submitTime : Time,
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

        let deadline : ?Time = f.metadata.deadline;

        switch (deadline) {
          case (?d) {
            if (submitTime > d) {
              Debug.print(Int.toText(submitTime) # ", " # Int.toText(d));
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

        let sendResult = await Ledger.sendICP(Principal.toText(caller), f.metadata.rewardAmount);
        switch (sendResult) {
          case (#err(e)) {
            return #err("ICP transfer failed: " # e);
          };
          case (#ok(_)) {};
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

  public composite query func getFormResponseSummary(caller : Principal, formId : Text) : async Response<(Nat, [FormResponseSummary])> {
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
                      func(i) { ((i + question.minRange), 0) },
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

          for (i in Iter.range(0, answers.size() - 1)) {
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
                          summary = #FrequencyArray(
                            Array.mapEntries<Nat, Nat>(
                              arr,
                              func(x, index) {
                                if (index == a) x + 1 else x;
                              },
                            )
                          );
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
                        summary = #FrequencyArray(
                          Array.mapEntries<Nat, Nat>(
                            arr,
                            func(x, index) {
                              if (index == choice) x + 1 else x;
                            },
                          )
                        );
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
                          summary = #FrequencyMap(
                            Array.map<(Nat, Nat), (Nat, Nat)>(
                              map,
                              func((key, count)) {
                                if (key == a) (key, count + 1) else (key, count);
                              },
                            )
                          );
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
        return #ok(responses.size(), Array.freeze(summaries));
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

  public func hashMemo(formId : Text) : async Blob {
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
      bytes[i] := Nat8.fromNat(temp % 256); // Use `mod 256` instead of `& 0xFF`
      temp := temp / 256; // Use integer division instead of `>>`
    };

    Blob.fromArray(Array.freeze(bytes));
  };

  public shared func changeFormPublish(caller : Principal, formId : Text) : async Response<Bool> {
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
        } catch (error) {
          return #err("Error retrieving transactions");
        };
      };
      case (null) {
        return #err("Form not found");
      };
    };
  };

  public shared func seed() : async Text {
    let dummyForms : [Form] = [
      {
        id = "form1";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Technology Trends Survey";
          description = "A survey about the latest trends in technology.";
          categories = ["technology", "artificial-intelligence"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form1";
            questionTitle = "What is your favorite AI technology?";
            questionType = #MultipleChoice({
              options = ["NLP", "Computer Vision", "Robotics"];
            });
            isRequired = true;
          },
          {
            formId = "form1";
            questionTitle = "How often do you use AI-based tools?";
            questionType = #Range({ minRange = 1; maxRange = 10 });
            isRequired = true;
          },
          {
            formId = "form1";
            questionTitle = "Share your thoughts on AI ethics.";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form1";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?1),
              #Range(?7),
              #Essay(?"AI ethics should prioritize transparency."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form1";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Range(?5),
              #Essay(?"There should be stronger AI regulations."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form2";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Healthcare and Well-being Survey";
          description = "A survey about personal well-being and healthcare accessibility.";
          categories = ["healthcare", "mental-health"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form2";
            questionTitle = "How would you rate your mental health?";
            questionType = #Range({ minRange = 1; maxRange = 10 });
            isRequired = true;
          },
          {
            formId = "form2";
            questionTitle = "Which healthcare services do you use?";
            questionType = #Checkbox({
              options = ["Telemedicine", "Regular check-ups", "Emergency services"];
            });
            isRequired = true;
          },
          {
            formId = "form2";
            questionTitle = "Do you think healthcare should be free?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form2";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?8),
              #Checkbox([0, 1]),
              #Essay(?"Yes, healthcare should be free for everyone."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form2";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?6),
              #Checkbox([1, 2]),
              #Essay(?"Healthcare should be affordable but not completely free."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form3";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Online Shopping Habits";
          description = "Understanding consumer behavior in online shopping.";
          categories = ["online-shopping", "consumer-behavior"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form3";
            questionTitle = "How often do you shop online?";
            questionType = #Range({ minRange = 1; maxRange = 10 });
            isRequired = true;
          },
          {
            formId = "form3";
            questionTitle = "What factors influence your purchase decisions?";
            questionType = #Checkbox({
              options = ["Price", "Brand", "Reviews", "Shipping Speed"];
            });
            isRequired = true;
          },
          {
            formId = "form3";
            questionTitle = "Describe your best online shopping experience.";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form3";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?9),
              #Checkbox([0, 2]),
              #Essay(?"I bought a laptop on sale with fast shipping!"),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form3";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?6),
              #Checkbox([1, 3]),
              #Essay(?"Customer service resolved my issue quickly."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form4";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Fitness & Wellness Survey";
          description = "Exploring people's habits in fitness and well-being.";
          categories = ["fitness-wellness", "self-improvement"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form4";
            questionTitle = "How many times do you exercise per week?";
            questionType = #Range({ minRange = 0; maxRange = 7 });
            isRequired = true;
          },
          {
            formId = "form4";
            questionTitle = "What types of workouts do you prefer?";
            questionType = #Checkbox({
              options = ["Cardio", "Weightlifting", "Yoga", "Sports"];
            });
            isRequired = true;
          },
          {
            formId = "form4";
            questionTitle = "Describe how fitness has changed your life.";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form4";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?4),
              #Checkbox([0, 1]),
              #Essay(?"Regular exercise has improved my energy levels."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form4";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?6),
              #Checkbox([2, 3]),
              #Essay(?"Yoga has helped with my stress and flexibility."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form5";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Gaming Preferences Survey";
          description = "Understanding different gaming habits and preferences.";
          categories = ["gaming", "media-consumption"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form5";
            questionTitle = "How many hours do you game per week?";
            questionType = #Range({ minRange = 0; maxRange = 50 });
            isRequired = true;
          },
          {
            formId = "form5";
            questionTitle = "What is your favorite gaming genre?";
            questionType = #MultipleChoice({
              options = ["RPG", "FPS", "MOBA", "Strategy"];
            });
            isRequired = true;
          },
          {
            formId = "form5";
            questionTitle = "What makes a game enjoyable for you?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form5";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?15),
              #MultipleChoice(?0),
              #Essay(?"I love open-world exploration and character progression."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form5";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #Range(?20),
              #MultipleChoice(?2),
              #Essay(?"Multiplayer competition and teamwork make games fun!"),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form6";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Remote Work Experience";
          description = "Gathering insights on the impact of remote work.";
          categories = ["workplace-culture", "career-development"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form6";
            questionTitle = "Do you prefer remote work over in-office work?";
            questionType = #MultipleChoice({ options = ["Yes", "No", "Hybrid"] });
            isRequired = true;
          },
          {
            formId = "form6";
            questionTitle = "What challenges do you face while working remotely?";
            questionType = #Checkbox({
              options = ["Communication", "Distractions", "Work-life balance", "Technical issues"];
            });
            isRequired = true;
          },
          {
            formId = "form6";
            questionTitle = "Share your best remote work experience.";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form6";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?0),
              #Checkbox([1, 2]),
              #Essay(?"I enjoy having flexible hours and avoiding the commute."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form6";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([0, 3]),
              #Essay(?"Hybrid work lets me socialize at the office and stay productive at home."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form7";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Sustainable Living Survey";
          description = "Exploring how people adopt eco-friendly habits.";
          categories = ["sustainability", "environment"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form7";
            questionTitle = "Do you actively try to reduce your carbon footprint?";
            questionType = #MultipleChoice({
              options = ["Yes", "No", "Somewhat"];
            });
            isRequired = true;
          },
          {
            formId = "form7";
            questionTitle = "Which sustainable practices do you follow?";
            questionType = #Checkbox({
              options = ["Recycling", "Minimal waste", "Using public transport", "Plant-based diet"];
            });
            isRequired = true;
          },
          {
            formId = "form7";
            questionTitle = "What motivates you to live sustainably?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form7";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?0),
              #Checkbox([0, 1, 2]),
              #Essay(?"Protecting nature for future generations is important to me."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form7";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([1, 3]),
              #Essay(?"Health benefits and ethical reasons inspire me."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form8";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Cryptocurrency Investment Trends";
          description = "Understanding people's perspectives on crypto investments.";
          categories = ["cryptocurrency", "finance-investment"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form8";
            questionTitle = "Do you currently invest in cryptocurrency?";
            questionType = #MultipleChoice({
              options = ["Yes", "No", "Planning to"];
            });
            isRequired = true;
          },
          {
            formId = "form8";
            questionTitle = "Which cryptocurrencies do you own?";
            questionType = #Checkbox({
              options = ["Bitcoin", "Ethereum", "Altcoins", "Stablecoins"];
            });
            isRequired = true;
          },
          {
            formId = "form8";
            questionTitle = "What concerns you the most about crypto investments?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form8";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?0),
              #Checkbox([0, 1, 2]),
              #Essay(?"Market volatility is my biggest concern."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form8";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([1, 3]),
              #Essay(?"Regulation uncertainty makes me hesitant to invest more."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form9";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Pet Ownership Survey";
          description = "Exploring trends in pet ownership and care.";
          categories = ["pet-care", "lifestyle"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form9";
            questionTitle = "Do you currently own a pet?";
            questionType = #MultipleChoice({
              options = ["Yes", "No", "Planning to"];
            });
            isRequired = true;
          },
          {
            formId = "form9";
            questionTitle = "What types of pets do you have?";
            questionType = #Checkbox({
              options = ["Dogs", "Cats", "Birds", "Other"];
            });
            isRequired = true;
          },
          {
            formId = "form9";
            questionTitle = "Describe the joy of having a pet.";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form9";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?0),
              #Checkbox([0, 2]),
              #Essay(?"Having a dog makes every day exciting and active."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form9";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?1),
              #Checkbox([1]),
              #Essay(?"My cat is my best companion and brings me comfort."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form10";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Healthy Eating Habits";
          description = "Understanding how people maintain a balanced diet.";
          categories = ["food", "healthcare"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form10";
            questionTitle = "Do you follow a specific diet?";
            questionType = #MultipleChoice({
              options = ["Vegan", "Vegetarian", "Keto", "None"];
            });
            isRequired = true;
          },
          {
            formId = "form10";
            questionTitle = "What healthy foods do you eat regularly?";
            questionType = #Checkbox({
              options = ["Fruits", "Vegetables", "Whole grains", "Protein"];
            });
            isRequired = true;
          },
          {
            formId = "form10";
            questionTitle = "What motivates you to eat healthily?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form10";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?1),
              #Checkbox([0, 1, 2]),
              #Essay(?"I want to stay fit and energetic."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form10";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?3),
              #Checkbox([1, 2, 3]),
              #Essay(?"I eat healthy to prevent diseases."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form11";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Online Shopping Behavior";
          description = "Examining the trends in online shopping.";
          categories = ["online-shopping", "consumer-behavior"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form11";
            questionTitle = "How often do you shop online?";
            questionType = #MultipleChoice({
              options = ["Daily", "Weekly", "Monthly", "Rarely"];
            });
            isRequired = true;
          },
          {
            formId = "form11";
            questionTitle = "What type of products do you buy online?";
            questionType = #Checkbox({
              options = ["Clothing", "Electronics", "Groceries", "Home decor"];
            });
            isRequired = true;
          },
          {
            formId = "form11";
            questionTitle = "What do you like most about online shopping?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form11";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?1),
              #Checkbox([0, 2]),
              #Essay(?"Convenience and better deals."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form11";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([1, 3]),
              #Essay(?"I enjoy the variety and ease of shopping."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form12";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Workplace Happiness Survey";
          description = "Exploring factors that contribute to employee happiness.";
          categories = ["workplace-culture", "job-satisfaction"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form12";
            questionTitle = "Are you happy with your current job?";
            questionType = #MultipleChoice({
              options = ["Yes", "No", "Somewhat"];
            });
            isRequired = true;
          },
          {
            formId = "form12";
            questionTitle = "What factors contribute to your workplace happiness?";
            questionType = #Checkbox({
              options = ["Salary", "Work-life balance", "Company culture", "Career growth"];
            });
            isRequired = true;
          },
          {
            formId = "form12";
            questionTitle = "What changes would improve your job satisfaction?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form12";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?0),
              #Checkbox([1, 2]),
              #Essay(?"More flexibility and career growth opportunities."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form12";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([0, 3]),
              #Essay(?"Better salary and remote work options."),
            ];
            submitTime = Time.now();
          },
        ];
      },
      {
        id = "form13";
        creator = Principal.fromText("2vxsx-fae");
        createdAt = Time.now();
        metadata = {
          deadline = null;
          published = true;
          minAge = null;
          maxAge = null;
          country = null;
          city = null;
          occupation = null;
          title = "Fitness and Wellness Survey";
          description = "Understanding people's fitness habits and wellness goals.";
          categories = ["fitness-wellness", "self-improvement"];
          maxRespondent = 10;
          maxRewardPool = 5_000_000;
          rewardAmount = 50_000_000;
        };
        questions = [
          {
            formId = "form13";
            questionTitle = "How often do you exercise?";
            questionType = #MultipleChoice({
              options = ["Daily", "Few times a week", "Rarely", "Never"];
            });
            isRequired = true;
          },
          {
            formId = "form13";
            questionTitle = "What types of workouts do you do?";
            questionType = #Checkbox({
              options = ["Cardio", "Strength training", "Yoga", "Sports"];
            });
            isRequired = true;
          },
          {
            formId = "form13";
            questionTitle = "What keeps you motivated to stay fit?";
            questionType = #Essay;
            isRequired = false;
          },
        ];
        responses = [
          {
            formId = "form13";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?1),
              #Checkbox([0, 2]),
              #Essay(?"I enjoy feeling strong and energetic."),
            ];
            submitTime = Time.now();
          },
          {
            formId = "form13";
            answerer = Principal.fromText("2vxsx-fae");
            answers = [
              #MultipleChoice(?2),
              #Checkbox([1, 3]),
              #Essay(?"Seeing progress and setting new goals keeps me going."),
            ];
            submitTime = Time.now();
          },
        ];
      }

    ];

    for (form in dummyForms.vals()) {
      forms.put(form.id, form);
    };

    "Seeded";
  };

  public query func getAllForms() : async Response<[Form]> {
    // ENDVALIDATION
    var allForms : [Form] = [];
    for ((_, form) in forms.entries()) {
      allForms := Array.append(allForms, [form]);
    };
    #ok(allForms);
  };
};
