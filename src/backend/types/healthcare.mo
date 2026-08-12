import CommonTypes "common";

module {
  public type AvailabilitySlot = {
    date : Text;
    startTime : Text;
    endTime : Text;
    isBooked : Bool;
  };

  public type Doctor = {
    id : Nat;
    name : Text;
    specialization : Text;
    qualifications : [Text];
    rating : Float;
    availabilitySlots : [AvailabilitySlot];
    hourlyPrice : Nat;
    visitTypes : [CommonTypes.VisitType];
  };

  public type Appointment = {
    id : Nat;
    userId : CommonTypes.UserId;
    doctorId : Nat;
    dateTime : Text;
    visitType : CommonTypes.VisitType;
    notes : Text;
    status : CommonTypes.AppointmentStatus;
    createdAt : CommonTypes.Timestamp;
  };

  public type BookAppointmentInput = {
    doctorId : Nat;
    dateTime : Text;
    visitType : CommonTypes.VisitType;
    notes : Text;
  };
};
