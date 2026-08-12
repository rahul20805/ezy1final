import HealthcareTypes "../types/healthcare";
import HealthcareLib "../lib/healthcare";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  doctors : List.List<HealthcareTypes.Doctor>,
  appointments : List.List<HealthcareTypes.Appointment>,
  nextAppointmentId : { var val : Nat },
) {
  public shared query func listDoctors() : async [HealthcareTypes.Doctor] {
    HealthcareLib.getDoctors(doctors);
  };

  public shared query func getDoctor(doctorId : Nat) : async ?HealthcareTypes.Doctor {
    HealthcareLib.getDoctor(doctors, doctorId);
  };

  public shared query ({ caller }) func getMyAppointments() : async [HealthcareTypes.Appointment] {
    HealthcareLib.getAppointments(appointments, caller);
  };

  public shared ({ caller }) func bookAppointment(input : HealthcareTypes.BookAppointmentInput) : async HealthcareTypes.Appointment {
    let now = Time.now();
    nextAppointmentId.val += 1;
    HealthcareLib.bookAppointment(appointments, nextAppointmentId.val, caller, input, now);
  };

  public shared ({ caller }) func cancelAppointment(appointmentId : Nat) : async Bool {
    HealthcareLib.cancelAppointment(appointments, appointmentId, caller);
  };
};
