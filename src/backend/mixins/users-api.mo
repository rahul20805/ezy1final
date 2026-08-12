import UserTypes "../types/users";
import WalletTypes "../types/wallet";
import UsersLib "../lib/users";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  users : List.List<UserTypes.User>,
  wallets : List.List<WalletTypes.Wallet>,
) {
  public shared query ({ caller }) func getMyProfile() : async ?UserTypes.UserPublic {
    UsersLib.getUser(users, caller);
  };

  public shared ({ caller }) func registerUser(input : UserTypes.RegisterUserInput) : async UserTypes.UserPublic {
    let now = Time.now();
    UsersLib.registerUser(users, wallets, caller, input, now);
  };

  public shared ({ caller }) func updateProfile(input : UserTypes.RegisterUserInput) : async ?UserTypes.UserPublic {
    UsersLib.updateProfile(users, caller, input);
  };
};
