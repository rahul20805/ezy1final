import CommonTypes "../types/common";
import UserTypes "../types/users";
import WalletTypes "../types/wallet";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func getUser(
    users : List.List<UserTypes.User>,
    id : CommonTypes.UserId,
  ) : ?UserTypes.UserPublic {
    switch (users.find(func(u) { Principal.equal(u.id, id) })) {
      case (?u) ?toPublic(u);
      case null null;
    };
  };

  public func registerUser(
    users : List.List<UserTypes.User>,
    wallets : List.List<WalletTypes.Wallet>,
    id : CommonTypes.UserId,
    input : UserTypes.RegisterUserInput,
    now : CommonTypes.Timestamp,
  ) : UserTypes.UserPublic {
    // If already registered, return existing profile
    switch (users.find(func(u) { Principal.equal(u.id, id) })) {
      case (?existing) return toPublic(existing);
      case null {};
    };
    let newUser : UserTypes.User = {
      id;
      var name = input.name;
      var email = input.email;
      var phone = input.phone;
      var role = #user;
      var savedAddresses = [];
      var preferredLanguage = input.preferredLanguage;
      createdAt = now;
    };
    users.add(newUser);
    // Create wallet for the new user
    let newWallet : WalletTypes.Wallet = {
      userId = id;
      var balance = 500; // welcome bonus
      var transactions = [{
        id = 1;
        date = now;
        description = "Welcome Bonus";
        amount = 500;
        txType = #credit;
      }];
    };
    wallets.add(newWallet);
    toPublic(newUser);
  };

  public func updateProfile(
    users : List.List<UserTypes.User>,
    id : CommonTypes.UserId,
    input : UserTypes.RegisterUserInput,
  ) : ?UserTypes.UserPublic {
    switch (users.find(func(u) { Principal.equal(u.id, id) })) {
      case (?u) {
        u.name := input.name;
        u.email := input.email;
        u.phone := input.phone;
        u.preferredLanguage := input.preferredLanguage;
        ?toPublic(u);
      };
      case null null;
    };
  };

  public func toPublic(user : UserTypes.User) : UserTypes.UserPublic {
    {
      id = user.id;
      name = user.name;
      email = user.email;
      phone = user.phone;
      role = user.role;
      savedAddresses = user.savedAddresses;
      preferredLanguage = user.preferredLanguage;
      createdAt = user.createdAt;
    };
  };
};
