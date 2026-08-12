import CommonTypes "../types/common";
import WalletTypes "../types/wallet";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func getWallet(
    wallets : List.List<WalletTypes.Wallet>,
    userId : CommonTypes.UserId,
  ) : ?WalletTypes.WalletPublic {
    switch (wallets.find(func(w) { Principal.equal(w.userId, userId) })) {
      case (?w) ?toPublic(w);
      case null null;
    };
  };

  public func getTransactions(
    wallets : List.List<WalletTypes.Wallet>,
    userId : CommonTypes.UserId,
  ) : [WalletTypes.Transaction] {
    switch (wallets.find(func(w) { Principal.equal(w.userId, userId) })) {
      case (?w) w.transactions;
      case null [];
    };
  };

  public func toPublic(wallet : WalletTypes.Wallet) : WalletTypes.WalletPublic {
    {
      userId = wallet.userId;
      balance = wallet.balance;
      transactions = wallet.transactions;
    };
  };
};
