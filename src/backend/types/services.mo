import CommonTypes "common";

module {
  public type Worker = {
    id : Nat;
    name : Text;
    category : Text;
    var rating : Float;
    var totalReviews : Nat;
    var pricePerHour : Nat;
    var isAvailable : Bool;
    var earnings : Nat;
    registeredAt : CommonTypes.Timestamp;
    ownerId : CommonTypes.UserId;
  };

  public type WorkerPublic = {
    id : Nat;
    name : Text;
    category : Text;
    rating : Float;
    totalReviews : Nat;
    pricePerHour : Nat;
    isAvailable : Bool;
    registeredAt : CommonTypes.Timestamp;
  };

  public type ServiceBookingStatus = {
    #requested;
    #accepted;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type ServiceBooking = {
    id : Nat;
    workerId : Nat;
    userId : CommonTypes.UserId;
    scheduledAt : CommonTypes.Timestamp;
    var status : ServiceBookingStatus;
    totalAmount : Nat;
    address : Text;
    createdAt : CommonTypes.Timestamp;
  };
};
