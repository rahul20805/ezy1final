import CommonTypes "../types/common";
import VendorTypes "../types/vendors";
import VendorsLib "../lib/vendors";
import UserTypes "../types/users";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  vendors : List.List<VendorTypes.Vendor>,
  approvals : List.List<VendorTypes.AdminApproval>,
  users : List.List<UserTypes.User>,
  nextVendorId : { var val : Nat },
  nextListingId : { var val : Nat },
  bootstrapAdmin : { var val : ?CommonTypes.UserId },
) {
  // Check if caller is admin (first registered user = bootstrap admin, or role == #admin)
  func isAdmin(caller : Principal) : Bool {
    switch (bootstrapAdmin.val) {
      case (?admin) {
        if (Principal.equal(caller, admin)) return true;
      };
      case null {};
    };
    switch (users.find(func(u) { Principal.equal(u.id, caller) })) {
      case (?u) u.role == #admin;
      case null false;
    };
  };

  public shared query func listApprovedVendors() : async [VendorTypes.VendorPublic] {
    VendorsLib.getApprovedVendors(vendors);
  };

  public shared query ({ caller }) func getMyVendorProfile() : async ?VendorTypes.VendorPublic {
    VendorsLib.getMyVendorProfile(vendors, caller);
  };

  public shared query ({ caller }) func getPendingApprovals() : async [VendorTypes.AdminApprovalPublic] {
    if (not isAdmin(caller)) {
      return [];
    };
    VendorsLib.getPendingApprovals(approvals);
  };

  public shared ({ caller }) func registerVendor(input : VendorTypes.RegisterVendorInput) : async VendorTypes.VendorPublic {
    let now = Time.now();
    nextVendorId.val += 1;
    // Set first registrant as bootstrap admin if none set
    if (bootstrapAdmin.val == null) {
      bootstrapAdmin.val := ?caller;
    };
    VendorsLib.registerVendor(vendors, approvals, nextVendorId.val, caller, input, now);
  };

  public shared ({ caller }) func approveVendor(vendorId : Nat) : async () {
    if (not isAdmin(caller)) {
      return ();
    };
    let now = Time.now();
    VendorsLib.approveVendor(vendors, approvals, vendorId, caller, now);
  };

  public shared ({ caller }) func rejectVendor(vendorId : Nat, reason : Text) : async () {
    if (not isAdmin(caller)) {
      return ();
    };
    let now = Time.now();
    VendorsLib.rejectVendor(vendors, approvals, vendorId, caller, reason, now);
  };

  public shared ({ caller }) func addListing(input : VendorTypes.ListingInput) : async ?VendorTypes.Listing {
    nextListingId.val += 1;
    VendorsLib.addListing(vendors, nextListingId.val, caller, input);
  };

  public shared ({ caller }) func updateListing(listingId : Nat, input : VendorTypes.ListingInput) : async Bool {
    VendorsLib.updateListing(vendors, caller, listingId, input);
  };

  public shared ({ caller }) func removeListing(listingId : Nat) : async Bool {
    VendorsLib.deleteListing(vendors, caller, listingId);
  };
};
