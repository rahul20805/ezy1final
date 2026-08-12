import CommonTypes "../types/common";
import TransportTypes "../types/transport";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func getBusRoutes(
    busRoutes : List.List<TransportTypes.BusRoute>
  ) : [TransportTypes.BusRoute] {
    busRoutes.toArray();
  };

  public func getRideRequests(
    rideRequests : List.List<TransportTypes.RideRequest>,
    userId : CommonTypes.UserId,
  ) : [TransportTypes.RideRequest] {
    rideRequests.filter(func(r) {
      Principal.equal(r.userId, userId)
    }).toArray();
  };

  public func requestRide(
    rideRequests : List.List<TransportTypes.RideRequest>,
    nextId : Nat,
    userId : CommonTypes.UserId,
    input : TransportTypes.RequestRideInput,
    now : CommonTypes.Timestamp,
  ) : TransportTypes.RideRequest {
    // Simple fare estimate: base 50 + 10 per passenger
    let fare : Nat = 50 + (input.passengerCount * 10);
    let ride : TransportTypes.RideRequest = {
      id = nextId;
      userId;
      pickupLocation = input.pickupLocation;
      dropoffLocation = input.dropoffLocation;
      datetime = input.datetime;
      passengerCount = input.passengerCount;
      rideType = input.rideType;
      fare;
      status = #pending;
      assignedDriverId = null;
      createdAt = now;
    };
    rideRequests.add(ride);
    ride;
  };

  public func cancelRide(
    rideRequests : List.List<TransportTypes.RideRequest>,
    rideId : Nat,
    userId : CommonTypes.UserId,
  ) : Bool {
    var found = false;
    rideRequests.mapInPlace(func(r) {
      if (r.id == rideId and Principal.equal(r.userId, userId)) {
        found := true;
        { r with status = #cancelled };
      } else { r };
    });
    found;
  };

  public func seedBusRoutes(busRoutes : List.List<TransportTypes.BusRoute>) {
    busRoutes.add({
      id = 1;
      routeName = "Mumbai Central — Andheri Express";
      departureTime = "07:00";
      arrivalTime = "08:15";
      stops = [
        { name = "Mumbai Central"; arrivalTime = "07:00" },
        { name = "Dadar"; arrivalTime = "07:25" },
        { name = "Bandra"; arrivalTime = "07:45" },
        { name = "Andheri"; arrivalTime = "08:15" },
      ];
      price = 45;
      availability = 30;
    });
    busRoutes.add({
      id = 2;
      routeName = "Delhi Kashmere Gate — Noida City Centre";
      departureTime = "08:30";
      arrivalTime = "09:45";
      stops = [
        { name = "Kashmere Gate"; arrivalTime = "08:30" },
        { name = "Rajiv Chowk"; arrivalTime = "08:50" },
        { name = "Lajpat Nagar"; arrivalTime = "09:15" },
        { name = "Noida City Centre"; arrivalTime = "09:45" },
      ];
      price = 60;
      availability = 25;
    });
    busRoutes.add({
      id = 3;
      routeName = "Bangalore Majestic — Electronic City";
      departureTime = "09:00";
      arrivalTime = "10:30";
      stops = [
        { name = "Majestic"; arrivalTime = "09:00" },
        { name = "Jayanagar"; arrivalTime = "09:20" },
        { name = "Silk Board"; arrivalTime = "09:55" },
        { name = "Electronic City"; arrivalTime = "10:30" },
      ];
      price = 55;
      availability = 40;
    });
    busRoutes.add({
      id = 4;
      routeName = "Patna Railway Station — Danapur";
      departureTime = "06:30";
      arrivalTime = "07:30";
      stops = [
        { name = "Patna Railway Station"; arrivalTime = "06:30" },
        { name = "Patna City"; arrivalTime = "06:50" },
        { name = "Phulwari Sharif"; arrivalTime = "07:10" },
        { name = "Danapur"; arrivalTime = "07:30" },
      ];
      price = 20;
      availability = 50;
    });
  };
};
