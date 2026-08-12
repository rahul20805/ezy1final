import CommonTypes "common";

module {
  public type BusStop = {
    name : Text;
    arrivalTime : Text;
  };

  public type BusRoute = {
    id : Nat;
    routeName : Text;
    departureTime : Text;
    arrivalTime : Text;
    stops : [BusStop];
    price : Nat;
    availability : Nat;
  };

  public type RideRequest = {
    id : Nat;
    userId : CommonTypes.UserId;
    pickupLocation : Text;
    dropoffLocation : Text;
    datetime : Text;
    passengerCount : Nat;
    rideType : Text;
    fare : Nat;
    status : CommonTypes.RideStatus;
    assignedDriverId : ?CommonTypes.UserId;
    createdAt : CommonTypes.Timestamp;
  };

  public type RequestRideInput = {
    pickupLocation : Text;
    dropoffLocation : Text;
    datetime : Text;
    passengerCount : Nat;
    rideType : Text;
  };
};
