import CommonTypes "common";

module {
  public type Transaction = {
    id : Nat;
    date : CommonTypes.Timestamp;
    description : Text;
    amount : Nat;
    txType : CommonTypes.TransactionType;
  };

  public type Wallet = {
    userId : CommonTypes.UserId;
    var balance : Nat;
    var transactions : [Transaction];
  };

  public type WalletPublic = {
    userId : CommonTypes.UserId;
    balance : Nat;
    transactions : [Transaction];
  };
};
