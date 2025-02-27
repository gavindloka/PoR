import ICPLledger "canister:icp_ledger_canister";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Error "mo:base/Error";
actor Ledger{
  type Result<T, E> = Result.Result<T, E>;
  type Response<T> = Result<T, Text>;
  // get balance
  public func getBalanceFromLedger(user:Text) : async Response<Nat> {
    try{
      let results = await ICPLledger.icrc1_balance_of({
        owner = Principal.fromText(user);
        subaccount = null;
      });
      return #ok(results);
    }catch(error){
      return #err(Error.message(error))
    };
   
  };

  public func sendICP(recipient:Text, amt:Nat): async Response<()>{
    try{
      let transferResult = await ICPLledger.icrc1_transfer({
        to = {
          owner = Principal.fromText(recipient);
          subaccount = null;
        };
        amount = amt;
        fee = null;
        memo = null;
        from_subaccount = null;
        created_at_time = null;
      });
      switch(transferResult){
        case(#Ok(results)){return #ok();};
        case(#Err(error)){
          return #err("Error in transfering tokens");
        };        
      };
    }catch(error){
      return #err(Error.message(error));
    };
  }
};
