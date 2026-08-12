import CommonTypes "common";

module {
  public type ProductCategory = {
    id : Nat;
    name : Text;
    description : Text;
    image : Text;
    parentCategoryId : ?Nat;
  };

  public type Product = {
    id : Nat;
    vendorId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    mrp : Nat;
    images : [Text];
    categoryIds : [Nat];
    inStock : Bool;
    stockCount : Nat;
    isAvailable : Bool;
    var rating : Float;
    var totalReviews : Nat;
  };

  public type ProductPublic = {
    id : Nat;
    vendorId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    mrp : Nat;
    images : [Text];
    categoryIds : [Nat];
    inStock : Bool;
    stockCount : Nat;
    isAvailable : Bool;
    rating : Float;
    totalReviews : Nat;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Cart = {
    userId : CommonTypes.UserId;
    items : [CartItem];
    updatedAt : CommonTypes.Timestamp;
  };

  public type OrderStatus = {
    #placed;
    #confirmed;
    #preparing;
    #ready;
    #outForDelivery;
    #delivered;
    #cancelled;
    #refunded;
  };

  public type OrderItem = {
    productId : Nat;
    vendorId : Nat;
    quantity : Nat;
    priceAtTime : Nat;
  };

  public type Order = {
    id : Nat;
    userId : CommonTypes.UserId;
    vendorId : Nat;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    deliveryAddress : Text;
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
  };

  public type Review = {
    id : Nat;
    targetId : Nat; // Product or Vendor ID
    userId : CommonTypes.UserId;
    rating : Nat;
    comment : Text;
    createdAt : CommonTypes.Timestamp;
    isVerifiedPurchase : Bool;
  };

  public type Coupon = {
    code : Text;
    discountPercent : Nat;
    maxDiscountAmount : Nat;
    minOrderAmount : Nat;
    validUntil : CommonTypes.Timestamp;
    isActive : Bool;
  };
};
