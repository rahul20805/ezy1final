import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import List "mo:core/List";

mixin (
  wallets : List.List<WalletTypes.Wallet>,
) {
  public shared query ({ caller }) func getMyWallet() : async ?WalletTypes.WalletPublic {
    WalletLib.getWallet(wallets, caller);
  };

  public shared query ({ caller }) func getMyTransactions() : async [WalletTypes.Transaction] {
    WalletLib.getTransactions(wallets, caller);
  };
};
