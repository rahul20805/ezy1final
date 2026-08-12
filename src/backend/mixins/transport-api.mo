import TransportTypes "../types/transport";
import TransportLib "../lib/transport";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  busRoutes : List.List<TransportTypes.BusRoute>,
  rideRequests : List.List<TransportTypes.RideRequest>,
  nextRideId : { var val : Nat },
) {
  public shared query func listBusRoutes() : async [TransportTypes.BusRoute] {
    TransportLib.getBusRoutes(busRoutes);
  };

  public shared query ({ caller }) func getMyRides() : async [TransportTypes.RideRequest] {
    TransportLib.getRideRequests(rideRequests, caller);
  };

  public shared ({ caller }) func requestRide(input : TransportTypes.RequestRideInput) : async TransportTypes.RideRequest {
    let now = Time.now();
    nextRideId.val += 1;
    TransportLib.requestRide(rideRequests, nextRideId.val, caller, input, now);
  };

  public shared ({ caller }) func cancelRide(rideId : Nat) : async Bool {
    TransportLib.cancelRide(rideRequests, rideId, caller);
  };
};
