import CommonTypes "common";

module {
  public type Listing = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  public type Location = {
    latitude : Float;
    longitude : Float;
    address : Text;
    city : Text;
  };

  public type OperatingHours = {
    openTime : Text; // e.g. "09:00"
    closeTime : Text; // e.g. "21:00"
    isOpen : Bool;
  };

  public type Vendor = {
    id : Nat;
    name : Text;
    ownerName : Text;
    vendorType : CommonTypes.VendorType;
    var approvalStatus : CommonTypes.ApprovalStatus;
    contactInfo : Text;
    var location : ?Location;
    var operatingHours : ?OperatingHours;
    var deliveryRadiusKm : Float;
    var businessDocuments : [Text]; // Document URLs
    var offerings : [Listing];
    var rating : Float;
    var totalReviews : Nat;
    var earnings : Nat;
    registeredAt : CommonTypes.Timestamp;
    ownerId : CommonTypes.UserId;
  };

  public type VendorPublic = {
    id : Nat;
    name : Text;
    ownerName : Text;
    vendorType : CommonTypes.VendorType;
    approvalStatus : CommonTypes.ApprovalStatus;
    contactInfo : Text;
    location : ?Location;
    operatingHours : ?OperatingHours;
    deliveryRadiusKm : Float;
    offerings : [Listing];
    rating : Float;
    totalReviews : Nat;
    registeredAt : CommonTypes.Timestamp;
    ownerId : CommonTypes.UserId;
  };

  public type RegisterVendorInput = {
    name : Text;
    ownerName : Text;
    vendorType : CommonTypes.VendorType;
    contactInfo : Text;
    location : ?Location;
  };


  public type ListingInput = {
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  public type AdminApproval = {
    vendorId : Nat;
    submissionDate : CommonTypes.Timestamp;
    var reviewedDate : ?CommonTypes.Timestamp;
    var reviewedBy : ?CommonTypes.UserId;
    var decision : CommonTypes.ApprovalStatus;
    var rejectionReason : ?Text;
  };

  public type AdminApprovalPublic = {
    vendorId : Nat;
    submissionDate : CommonTypes.Timestamp;
    reviewedDate : ?CommonTypes.Timestamp;
    reviewedBy : ?CommonTypes.UserId;
    decision : CommonTypes.ApprovalStatus;
    rejectionReason : ?Text;
  };
};
