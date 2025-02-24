import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Blob "mo:base/Blob";
import Result "mo:base/Result";

type Result<T, E> = Result.Result<T, E>;

type Response<T> = Result<T, Text>;

actor Auth{
    type User = {
        id: Principal;
        name: ?Text;
        age: ?Nat;
        gender: ?Text;
        country: ?Text;
        city: ?Text;
        occupation: ?Text;
    };

    let users = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);

    public query func getUser(id:Principal):async Response<User>{
        let user : ?User = users.get(id);
        switch(user) {
            case(null) { #err("Account not verified!") };
            case(?user) { #ok(user) };
        };
    };

    public shared func verify(image: Blob) : async Response<()> {
        #err("Not implemented!");
    };

    public shared (msg) func updateUser(name: ?Text, age:?Nat, gender:?Text, country: ?Text, city: ?Text, occupation: ?Text): async Response<()>{
        let id = msg.caller;
        if(users.get(id) == null){
            return #err("Account not verified!");
        };

        let user:User = {
            id= id;
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
}