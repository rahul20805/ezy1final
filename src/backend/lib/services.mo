import ServicesTypes "../types/services";
import CommonTypes "../types/common";
import List "mo:core/List";

module {
  public func seedWorkers(workers : List.List<ServicesTypes.Worker>, now : CommonTypes.Timestamp) {
    let seedData : [ServicesTypes.Worker] = [
      {
        id = 1;
        name = "Rajesh Kumar";
        category = "Electrician";
        rating = 4.8;
        totalReviews = 120;
        pricePerHour = 200;
        isAvailable = true;
        earnings = 50000;
        registeredAt = now;
        ownerId = "dummy-principal";
      },
      {
        id = 2;
        name = "Sunita Devi";
        category = "Maid";
        rating = 4.9;
        totalReviews = 340;
        pricePerHour = 150;
        isAvailable = true;
        earnings = 80000;
        registeredAt = now;
        ownerId = "dummy-principal-2";
      }
    ];

    for (w in seedData.vals()) {
      List.push(w, workers);
    };
  };
};
