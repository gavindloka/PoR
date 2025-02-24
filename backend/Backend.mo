import Result "mo:base/Result";
import Auth "canister:auth";

actor class Backend() {
  type Result<T, E> = Result.Result<T, E>;

  // the type we return to the front end will be
  // error -> Text
  // ok -> T
  type Response<T> = Result<T, Text>;

  public composite query ({ caller }) func getUser() : async Response<Auth.User> {
    await Auth.getUser(caller);
  };

  public func verify(caller : Principal, image : Blob) : async Response<()> {
    await Auth.verify(caller, image);
  };

  public func updateUser(caller : Principal, name : ?Text, age : ?Nat, gender : ?Text, country : ?Text, city : ?Text, occupation : ?Text) : async Response<()> {
    await Auth.updateUser(caller, name, age, gender, country, city, occupation);
  };
};
