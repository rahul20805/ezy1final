import CommonTypes "common";

module {
  public type User = {
    id : CommonTypes.UserId;
    var name : Text;
    var email : Text;
    var phone : Text;
    var role : CommonTypes.Role;
    var savedAddresses : [Text];
    var preferredLanguage : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type UserPublic = {
    id : CommonTypes.UserId;
    name : Text;
    email : Text;
    phone : Text;
    role : CommonTypes.Role;
    savedAddresses : [Text];
    preferredLanguage : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type RegisterUserInput = {
    name : Text;
    email : Text;
    phone : Text;
    preferredLanguage : Text;
  };
};
