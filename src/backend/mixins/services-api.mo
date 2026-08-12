import ServicesTypes "../types/services";
import CommonTypes "../types/common";
import List "mo:core/List";
import Iter "mo:core/Iter";

module ServicesApiMixin(
  workers : List.List<ServicesTypes.Worker>,
  bookings : List.List<ServicesTypes.ServiceBooking>,
  nextWorkerId : { var val : Nat },
  nextBookingId : { var val : Nat }
) {
  public query func getWorkers() : async [ServicesTypes.WorkerPublic] {
    let publicWorkers = Iter.map(List.toIter(workers), func (w : ServicesTypes.Worker) : ServicesTypes.WorkerPublic {
      {
        id = w.id;
        name = w.name;
        category = w.category;
        rating = w.rating;
        totalReviews = w.totalReviews;
        pricePerHour = w.pricePerHour;
        isAvailable = w.isAvailable;
        registeredAt = w.registeredAt;
      }
    });
    Iter.toArray(publicWorkers);
  };
};
