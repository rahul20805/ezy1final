import CommonTypes "../types/common";
import HealthcareTypes "../types/healthcare";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func getDoctors(
    doctors : List.List<HealthcareTypes.Doctor>
  ) : [HealthcareTypes.Doctor] {
    doctors.toArray();
  };

  public func getDoctor(
    doctors : List.List<HealthcareTypes.Doctor>,
    doctorId : Nat,
  ) : ?HealthcareTypes.Doctor {
    doctors.find(func(d) { d.id == doctorId });
  };

  public func getAppointments(
    appointments : List.List<HealthcareTypes.Appointment>,
    userId : CommonTypes.UserId,
  ) : [HealthcareTypes.Appointment] {
    appointments.filter(func(a) {
      Principal.equal(a.userId, userId)
    }).toArray();
  };

  public func bookAppointment(
    appointments : List.List<HealthcareTypes.Appointment>,
    nextId : Nat,
    userId : CommonTypes.UserId,
    input : HealthcareTypes.BookAppointmentInput,
    now : CommonTypes.Timestamp,
  ) : HealthcareTypes.Appointment {
    let appt : HealthcareTypes.Appointment = {
      id = nextId;
      userId;
      doctorId = input.doctorId;
      dateTime = input.dateTime;
      visitType = input.visitType;
      notes = input.notes;
      status = #scheduled;
      createdAt = now;
    };
    appointments.add(appt);
    appt;
  };

  public func cancelAppointment(
    appointments : List.List<HealthcareTypes.Appointment>,
    appointmentId : Nat,
    userId : CommonTypes.UserId,
  ) : Bool {
    var found = false;
    appointments.mapInPlace(func(a) {
      if (a.id == appointmentId and Principal.equal(a.userId, userId)) {
        found := true;
        { a with status = (#cancelled : CommonTypes.AppointmentStatus) };
      } else { a };
    });
    found;
  };

  public func seedDoctors(doctors : List.List<HealthcareTypes.Doctor>) {
    doctors.add({
      id = 1;
      name = "Dr. Priya Sharma";
      specialization = "General Physician";
      qualifications = ["MBBS", "MD"];
      rating = 4.8;
      availabilitySlots = [
        { date = "2026-04-15"; startTime = "09:00"; endTime = "09:30"; isBooked = false },
        { date = "2026-04-15"; startTime = "10:00"; endTime = "10:30"; isBooked = false },
        { date = "2026-04-16"; startTime = "11:00"; endTime = "11:30"; isBooked = false },
      ];
      hourlyPrice = 500;
      visitTypes = [#clinic, #home];
    });
    doctors.add({
      id = 2;
      name = "Dr. Rajesh Kumar";
      specialization = "Cardiologist";
      qualifications = ["MBBS", "MD", "DM Cardiology"];
      rating = 4.9;
      availabilitySlots = [
        { date = "2026-04-15"; startTime = "14:00"; endTime = "14:30"; isBooked = false },
        { date = "2026-04-17"; startTime = "09:00"; endTime = "09:30"; isBooked = false },
      ];
      hourlyPrice = 1200;
      visitTypes = [#clinic];
    });
    doctors.add({
      id = 3;
      name = "Dr. Anita Desai";
      specialization = "Pediatrician";
      qualifications = ["MBBS", "DCH", "MD Pediatrics"];
      rating = 4.7;
      availabilitySlots = [
        { date = "2026-04-15"; startTime = "10:00"; endTime = "10:30"; isBooked = false },
        { date = "2026-04-16"; startTime = "15:00"; endTime = "15:30"; isBooked = false },
      ];
      hourlyPrice = 800;
      visitTypes = [#clinic, #home];
    });
    doctors.add({
      id = 4;
      name = "Dr. Suresh Nair";
      specialization = "Dermatologist";
      qualifications = ["MBBS", "MD Dermatology"];
      rating = 4.6;
      availabilitySlots = [
        { date = "2026-04-16"; startTime = "11:00"; endTime = "11:30"; isBooked = false },
        { date = "2026-04-18"; startTime = "09:00"; endTime = "09:30"; isBooked = false },
      ];
      hourlyPrice = 900;
      visitTypes = [#clinic];
    });
    doctors.add({
      id = 5;
      name = "Dr. Meena Iyer";
      specialization = "Gynaecologist";
      qualifications = ["MBBS", "MS Obstetrics & Gynaecology"];
      rating = 4.9;
      availabilitySlots = [
        { date = "2026-04-15"; startTime = "16:00"; endTime = "16:30"; isBooked = false },
        { date = "2026-04-17"; startTime = "14:00"; endTime = "14:30"; isBooked = false },
      ];
      hourlyPrice = 1000;
      visitTypes = [#clinic, #home];
    });
    doctors.add({
      id = 6;
      name = "Dr. Arun Patel";
      specialization = "Orthopedic Surgeon";
      qualifications = ["MBBS", "MS Orthopaedics", "DNB"];
      rating = 4.7;
      availabilitySlots = [
        { date = "2026-04-16"; startTime = "08:00"; endTime = "08:30"; isBooked = false },
        { date = "2026-04-17"; startTime = "10:00"; endTime = "10:30"; isBooked = false },
      ];
      hourlyPrice = 1100;
      visitTypes = [#clinic];
    });
  };
};
