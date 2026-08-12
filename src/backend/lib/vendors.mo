import CommonTypes "../types/common";
import VendorTypes "../types/vendors";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func getApprovedVendors(
    vendors : List.List<VendorTypes.Vendor>
  ) : [VendorTypes.VendorPublic] {
    let filtered = vendors.filter(func(v) {
      v.approvalStatus == #approved
    });
    filtered.map<VendorTypes.Vendor, VendorTypes.VendorPublic>(toPublic).toArray();
  };

  public func getMyVendorProfile(
    vendors : List.List<VendorTypes.Vendor>,
    ownerId : CommonTypes.UserId,
  ) : ?VendorTypes.VendorPublic {
    switch (vendors.find(func(v) { Principal.equal(v.ownerId, ownerId) })) {
      case (?v) ?toPublic(v);
      case null null;
    };
  };

  public func getPendingApprovals(
    approvals : List.List<VendorTypes.AdminApproval>
  ) : [VendorTypes.AdminApprovalPublic] {
    let pending = approvals.filter(func(a) {
      a.decision == #pending
    });
    pending.map<VendorTypes.AdminApproval, VendorTypes.AdminApprovalPublic>(approvalToPublic).toArray();
  };

  public func registerVendor(
    vendors : List.List<VendorTypes.Vendor>,
    approvals : List.List<VendorTypes.AdminApproval>,
    nextId : Nat,
    ownerId : CommonTypes.UserId,
    input : VendorTypes.RegisterVendorInput,
    now : CommonTypes.Timestamp,
  ) : VendorTypes.VendorPublic {
    let newVendor : VendorTypes.Vendor = {
      id = nextId;
      name = input.name;
      vendorType = input.vendorType;
      var approvalStatus = (#pending : CommonTypes.ApprovalStatus);
      contactInfo = input.contactInfo;
      var offerings = ([] : [VendorTypes.Listing]);
      var rating = 0.0;
      var earnings = 0;
      registeredAt = now;
      ownerId;
    };
    vendors.add(newVendor);
    let approval : VendorTypes.AdminApproval = {
      vendorId = nextId;
      submissionDate = now;
      var reviewedDate = (null : ?CommonTypes.Timestamp);
      var reviewedBy = (null : ?CommonTypes.UserId);
      var decision = (#pending : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    };
    approvals.add(approval);
    toPublic(newVendor);
  };

  public func approveVendor(
    vendors : List.List<VendorTypes.Vendor>,
    approvals : List.List<VendorTypes.AdminApproval>,
    vendorId : Nat,
    reviewedBy : CommonTypes.UserId,
    now : CommonTypes.Timestamp,
  ) {
    approvals.forEach(func(a) {
      if (a.vendorId == vendorId) {
        a.decision := #approved;
        a.reviewedBy := ?reviewedBy;
        a.reviewedDate := ?now;
      };
    });
    vendors.forEach(func(v) {
      if (v.id == vendorId) {
        v.approvalStatus := #approved;
      };
    });
  };

  public func rejectVendor(
    vendors : List.List<VendorTypes.Vendor>,
    approvals : List.List<VendorTypes.AdminApproval>,
    vendorId : Nat,
    reviewedBy : CommonTypes.UserId,
    reason : Text,
    now : CommonTypes.Timestamp,
  ) {
    approvals.forEach(func(a) {
      if (a.vendorId == vendorId) {
        a.decision := #rejected;
        a.reviewedBy := ?reviewedBy;
        a.reviewedDate := ?now;
        a.rejectionReason := ?reason;
      };
    });
    vendors.forEach(func(v) {
      if (v.id == vendorId) {
        v.approvalStatus := #rejected;
      };
    });
  };

  public func addListing(
    vendors : List.List<VendorTypes.Vendor>,
    nextListingId : Nat,
    ownerId : CommonTypes.UserId,
    input : VendorTypes.ListingInput,
  ) : ?VendorTypes.Listing {
    let newListing : VendorTypes.Listing = {
      id = nextListingId;
      title = input.title;
      description = input.description;
      price = input.price;
      category = input.category;
    };
    switch (vendors.find(func(v) { Principal.equal(v.ownerId, ownerId) })) {
      case (?v) {
        v.offerings := v.offerings.concat([newListing]);
        ?newListing;
      };
      case null null;
    };
  };

  public func updateListing(
    vendors : List.List<VendorTypes.Vendor>,
    ownerId : CommonTypes.UserId,
    listingId : Nat,
    input : VendorTypes.ListingInput,
  ) : Bool {
    switch (vendors.find(func(v) { Principal.equal(v.ownerId, ownerId) })) {
      case (?v) {
        let updated = v.offerings.map(
          func(l : VendorTypes.Listing) : VendorTypes.Listing {
            if (l.id == listingId) {
              { l with title = input.title; description = input.description; price = input.price; category = input.category };
            } else { l };
          }
        );
        v.offerings := updated;
        true;
      };
      case null false;
    };
  };

  public func deleteListing(
    vendors : List.List<VendorTypes.Vendor>,
    ownerId : CommonTypes.UserId,
    listingId : Nat,
  ) : Bool {
    switch (vendors.find(func(v) { Principal.equal(v.ownerId, ownerId) })) {
      case (?v) {
        v.offerings := v.offerings.filter(func(l) { l.id != listingId });
        true;
      };
      case null false;
    };
  };

  public func seedVendors(
    vendors : List.List<VendorTypes.Vendor>,
    approvals : List.List<VendorTypes.AdminApproval>,
    now : CommonTypes.Timestamp,
  ) {
    // 4 approved vendors
    vendors.add(({
      id = 1;
      name = "Sharma Kirana Store";
      vendorType = (#shop : CommonTypes.VendorType);
      var approvalStatus = (#approved : CommonTypes.ApprovalStatus);
      contactInfo = "+91-9876543210";
      var offerings = ([
        { id = 1; title = "Basmati Rice 5kg"; description = "Premium quality basmati rice"; price = 450; category = "Groceries" },
        { id = 2; title = "Toor Dal 1kg"; description = "Fresh yellow lentils"; price = 120; category = "Groceries" },
        { id = 3; title = "Cooking Oil 1L"; description = "Refined sunflower oil"; price = 180; category = "Groceries" },
      ] : [VendorTypes.Listing]);
      var rating = 4.6;
      var earnings = 45000;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    vendors.add(({
      id = 2;
      name = "Quick Fix Electronics";
      vendorType = (#service : CommonTypes.VendorType);
      var approvalStatus = (#approved : CommonTypes.ApprovalStatus);
      contactInfo = "+91-9988776655";
      var offerings = ([
        { id = 4; title = "Mobile Screen Repair"; description = "All brands, same-day service"; price = 799; category = "Electronics Repair" },
        { id = 5; title = "Laptop Servicing"; description = "Full diagnostics and cleaning"; price = 499; category = "Electronics Repair" },
      ] : [VendorTypes.Listing]);
      var rating = 4.4;
      var earnings = 32000;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    vendors.add(({
      id = 3;
      name = "Rajdhani Tiffin Service";
      vendorType = (#service : CommonTypes.VendorType);
      var approvalStatus = (#approved : CommonTypes.ApprovalStatus);
      contactInfo = "+91-9111222333";
      var offerings = ([
        { id = 6; title = "Veg Thali (Lunch)"; description = "Dal, sabzi, roti, rice, salad"; price = 80; category = "Food" },
        { id = 7; title = "Non-Veg Thali (Lunch)"; description = "Chicken curry, roti, rice, salad"; price = 120; category = "Food" },
        { id = 8; title = "Monthly Subscription"; description = "30-day veg lunch delivery"; price = 2000; category = "Food" },
      ] : [VendorTypes.Listing]);
      var rating = 4.8;
      var earnings = 78000;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    vendors.add(({
      id = 4;
      name = "CityRide Auto Services";
      vendorType = (#driver : CommonTypes.VendorType);
      var approvalStatus = (#approved : CommonTypes.ApprovalStatus);
      contactInfo = "+91-8899001122";
      var offerings = ([
        { id = 9; title = "City Auto Ride"; description = "Comfortable auto-rickshaw rides"; price = 15; category = "Transport" },
        { id = 10; title = "Airport Transfer"; description = "Sedan, AC, timely pickup"; price = 800; category = "Transport" },
      ] : [VendorTypes.Listing]);
      var rating = 4.3;
      var earnings = 56000;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    // Approvals for the 4 approved vendors
    approvals.add(({
      vendorId = 1;
      submissionDate = now;
      var reviewedDate = (?now : ?CommonTypes.Timestamp);
      var reviewedBy = (?Principal.fromText("2vxsx-fae") : ?CommonTypes.UserId);
      var decision = (#approved : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
    approvals.add(({
      vendorId = 2;
      submissionDate = now;
      var reviewedDate = (?now : ?CommonTypes.Timestamp);
      var reviewedBy = (?Principal.fromText("2vxsx-fae") : ?CommonTypes.UserId);
      var decision = (#approved : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
    approvals.add(({
      vendorId = 3;
      submissionDate = now;
      var reviewedDate = (?now : ?CommonTypes.Timestamp);
      var reviewedBy = (?Principal.fromText("2vxsx-fae") : ?CommonTypes.UserId);
      var decision = (#approved : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
    approvals.add(({
      vendorId = 4;
      submissionDate = now;
      var reviewedDate = (?now : ?CommonTypes.Timestamp);
      var reviewedBy = (?Principal.fromText("2vxsx-fae") : ?CommonTypes.UserId);
      var decision = (#approved : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
    // 2 pending vendors
    vendors.add(({
      id = 5;
      name = "Green Herb Pharmacy";
      vendorType = (#shop : CommonTypes.VendorType);
      var approvalStatus = (#pending : CommonTypes.ApprovalStatus);
      contactInfo = "+91-7700112233";
      var offerings = ([
        { id = 11; title = "Paracetamol 500mg"; description = "Pack of 10 tablets"; price = 25; category = "Medicine" },
      ] : [VendorTypes.Listing]);
      var rating = 0.0;
      var earnings = 0;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    vendors.add(({
      id = 6;
      name = "Village Crafts Hub";
      vendorType = (#shop : CommonTypes.VendorType);
      var approvalStatus = (#pending : CommonTypes.ApprovalStatus);
      contactInfo = "+91-6600998877";
      var offerings = ([
        { id = 12; title = "Handwoven Basket"; description = "Traditional bamboo basket"; price = 350; category = "Handicraft" },
      ] : [VendorTypes.Listing]);
      var rating = 0.0;
      var earnings = 0;
      registeredAt = now;
      ownerId = Principal.fromText("2vxsx-fae");
    } : VendorTypes.Vendor));
    // Approvals for the 2 pending vendors
    approvals.add(({
      vendorId = 5;
      submissionDate = now;
      var reviewedDate = (null : ?CommonTypes.Timestamp);
      var reviewedBy = (null : ?CommonTypes.UserId);
      var decision = (#pending : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
    approvals.add(({
      vendorId = 6;
      submissionDate = now;
      var reviewedDate = (null : ?CommonTypes.Timestamp);
      var reviewedBy = (null : ?CommonTypes.UserId);
      var decision = (#pending : CommonTypes.ApprovalStatus);
      var rejectionReason = (null : ?Text);
    } : VendorTypes.AdminApproval));
  };

  public func toPublic(vendor : VendorTypes.Vendor) : VendorTypes.VendorPublic {
    {
      id = vendor.id;
      name = vendor.name;
      vendorType = vendor.vendorType;
      approvalStatus = vendor.approvalStatus;
      contactInfo = vendor.contactInfo;
      offerings = vendor.offerings;
      rating = vendor.rating;
      earnings = vendor.earnings;
      registeredAt = vendor.registeredAt;
      ownerId = vendor.ownerId;
    };
  };

  public func approvalToPublic(a : VendorTypes.AdminApproval) : VendorTypes.AdminApprovalPublic {
    {
      vendorId = a.vendorId;
      submissionDate = a.submissionDate;
      reviewedDate = a.reviewedDate;
      reviewedBy = a.reviewedBy;
      decision = a.decision;
      rejectionReason = a.rejectionReason;
    };
  };
};
