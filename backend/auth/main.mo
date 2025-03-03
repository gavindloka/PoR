import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Ledger "canister:icp_ledger_canister_backend";
import Bool "mo:base/Bool";

actor Auth {
  type Result<T, E> = Result.Result<T, E>;
  type Response<T> = Result<T, Text>;

  type User = {
    id : Principal;
    name : ?Text;
    age : ?Nat;
    gender : ?Text;
    country : ?Text;
    city : ?Text;
    occupation : ?Text;
  };

  let users = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
  var debugMode = false;

  type Addition = {
    #Ok;
    #Err : Error;
  };

  type Person = {
    principal : Text;
    score : Float;
  };

  type Recognition = {
    #Ok : Person;
    #Err : Error;
  };

  type Error = {
    message : Text;
  };

  private class AI(canisterId : Text) {
    public let canister = actor (canisterId) : actor {
      recognize : (image : Blob) -> async (Recognition);
      add : (principal : Text, image : Blob) -> async (Addition);
      ping : () -> async (Text);
    };
  };

  public shared func setDebug(isDebug : Bool) : async Response<()> {
    debugMode := isDebug;
    #ok();
  };

  public query func getUser(id : Principal) : async Response<User> {
    let user : ?User = users.get(id);
    if (debugMode) {
      let newUser = {
        id = id;
        name = null;
        age = null;
        gender = null;
        country = null;
        city = null;
        occupation = null;
      };
      users.put(id, newUser);
      return #ok(newUser);
    };
    switch (user) {
      case (null) { #err("Account not verified!") };
      case (?user) { #ok(user) };
    };
  };

  stable var ai : ?AI = null;

  public func initialize(canisterId : Text) : async () {
    let newAI = AI(canisterId);
    Debug.print(await newAI.canister.ping());

    ai := ?newAI;
  };

  public func getAI() : async Result<AI, Text> {
    switch (ai) {
      case (?ai) { #ok(ai) };
      case (null) {
        #err("AI not initialized!");
      };
    };
  };

  public shared func verify(caller : Principal, image : Blob) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Not authorized!");
    };

    if (users.get(caller) != null) {
      return #err("Account already verified!");
    };

    let aiResult = await getAI();

    switch (aiResult) {
      case (#err(error)) {
        return #err(error);
      };
      case (#ok(ai)) {
        let recognize = await ai.canister.recognize(image);
        switch (recognize) {
          // Not recognized = new person
          case (#Err(error)) {
            Debug.print("verify.recognize.err: " # error.message);
            // need to save the new person in backend_ai
            let addResult = await ai.canister.add(Principal.toText(caller), image);
            switch (addResult) {
              case (#Ok(_)) {};
              case (#Err(error)) {
                Debug.print(error.message);
                return #err("Internal server error");
              };
            };

            let newUser = {
              id = caller;
              name = null;
              age = null;
              gender = null;
              country = null;
              city = null;
              occupation = null;
            };
            users.put(caller, newUser);
            let sendResult = await Ledger.sendICP(Principal.toText(caller), 100000000);
            switch (sendResult) {
              case (#err(e)) {
                return #err("ICP transfer failed: " # e);
              };
              case (#ok(_)) {};
            };
            #ok();
          };
          // Recognized = duplicate person
          case (#Ok(ok)) {
            Debug.print("verify.recognize.ok: " # ok.principal # Float.toText(ok.score));
            return #err("Face is already registered!");
          };
        };
      };
    };
  };

  public shared func updateUser(caller : Principal, name : ?Text, age : ?Nat, gender : ?Text, country : ?Text, city : ?Text, occupation : ?Text) : async Response<()> {
    if (Principal.isAnonymous(caller)) {
      return #err("Not authorized!");
    };

    if (users.get(caller) == null) {
      return #err("Account not verified!");
    };

    let user : User = {
      id = caller;
      name = name;
      age = age;
      gender = gender;
      country = country;
      city = city;
      occupation = occupation;
    };
    users.put(user.id, user);
    return #ok();
  };
};
