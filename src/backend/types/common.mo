module {
  public type UserId = Principal;
  public type Timestamp = Int;

  public type Role = {
    #user;
    #vendor;
    #driver;
    #admin;
  };

  public type ApprovalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type TransactionType = {
    #credit;
    #debit;
  };

  public type VisitType = {
    #clinic;
    #home;
  };

  public type AppointmentStatus = {
    #scheduled;
    #completed;
    #cancelled;
  };

  public type RideStatus = {
    #pending;
    #assigned;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type VendorType = {
    #shop;
    #driver;
    #service;
    #restaurant;
    #grocery;
    #medical;
    #electronics;
    #fashion;
    #beauty;
  };
};
