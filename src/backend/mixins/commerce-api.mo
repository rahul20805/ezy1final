import CommerceTypes "../types/commerce";
import List "mo:core/List";
import CommonTypes "../types/common";

module CommerceApiMixin {
  public type Mixin = <system>(
    products : List.List<CommerceTypes.Product>,
    categories : List.List<CommerceTypes.ProductCategory>,
    carts : List.List<CommerceTypes.Cart>,
    orders : List.List<CommerceTypes.Order>,
    nextProductId : { var val : Nat },
    nextOrderId : { var val : Nat }
  ) -> {
    getProducts : shared query () -> async [CommerceTypes.ProductPublic];
    getCategories : shared query () -> async [CommerceTypes.ProductCategory];
    getProductById : shared query (Nat) -> async ?CommerceTypes.ProductPublic;
    getProductsByCategory : shared query (Nat) -> async [CommerceTypes.ProductPublic];
    getProductsByVendor : shared query (Nat) -> async [CommerceTypes.ProductPublic];
  };

  public let Mixin : Mixin = func <system>(
    products, categories, carts, orders, nextProductId, nextOrderId
  ) {
    return {
      public shared query func getProducts() : async [CommerceTypes.ProductPublic] {
        var result : [CommerceTypes.ProductPublic] = [];
        var node = products;
        label L: while (true) {
          switch (node) {
            case null { break L };
            case (?n) {
              let p = n.0;
              let pub : CommerceTypes.ProductPublic = {
                id = p.id;
                vendorId = p.vendorId;
                name = p.name;
                description = p.description;
                price = p.price;
                mrp = p.mrp;
                images = p.images;
                categoryIds = p.categoryIds;
                inStock = p.inStock;
                stockCount = p.stockCount;
                isAvailable = p.isAvailable;
              };
              result := Array.append(result, [pub]);
              node := n.1;
            };
          };
        };
        return result;
      };

      public shared query func getCategories() : async [CommerceTypes.ProductCategory] {
        var result : [CommerceTypes.ProductCategory] = [];
        var node = categories;
        label L: while (true) {
          switch (node) {
            case null { break L };
            case (?n) {
              result := Array.append(result, [n.0]);
              node := n.1;
            };
          };
        };
        return result;
      };

      public shared query func getProductById(id : Nat) : async ?CommerceTypes.ProductPublic {
        var node = products;
        label L: while (true) {
          switch (node) {
            case null { return null };
            case (?n) {
              if (n.0.id == id) {
                let p = n.0;
                return ?{
                  id = p.id;
                  vendorId = p.vendorId;
                  name = p.name;
                  description = p.description;
                  price = p.price;
                  mrp = p.mrp;
                  images = p.images;
                  categoryIds = p.categoryIds;
                  inStock = p.inStock;
                  stockCount = p.stockCount;
                  isAvailable = p.isAvailable;
                };
              };
              node := n.1;
            };
          };
        };
        return null;
      };

      public shared query func getProductsByCategory(catId : Nat) : async [CommerceTypes.ProductPublic] {
        var result : [CommerceTypes.ProductPublic] = [];
        var node = products;
        label L: while (true) {
          switch (node) {
            case null { break L };
            case (?n) {
              let p = n.0;
              // Very simple category check (array contains)
              var hasCat = false;
              for (c in p.categoryIds.vals()) {
                if (c == catId) {
                  hasCat := true;
                };
              };
              if (hasCat) {
                let pub : CommerceTypes.ProductPublic = {
                  id = p.id;
                  vendorId = p.vendorId;
                  name = p.name;
                  description = p.description;
                  price = p.price;
                  mrp = p.mrp;
                  images = p.images;
                  categoryIds = p.categoryIds;
                  inStock = p.inStock;
                  stockCount = p.stockCount;
                  isAvailable = p.isAvailable;
                };
                result := Array.append(result, [pub]);
              };
              node := n.1;
            };
          };
        };
        return result;
      };

      public shared query func getProductsByVendor(vendorId : Nat) : async [CommerceTypes.ProductPublic] {
        var result : [CommerceTypes.ProductPublic] = [];
        var node = products;
        label L: while (true) {
          switch (node) {
            case null { break L };
            case (?n) {
              let p = n.0;
              if (p.vendorId == vendorId) {
                let pub : CommerceTypes.ProductPublic = {
                  id = p.id;
                  vendorId = p.vendorId;
                  name = p.name;
                  description = p.description;
                  price = p.price;
                  mrp = p.mrp;
                  images = p.images;
                  categoryIds = p.categoryIds;
                  inStock = p.inStock;
                  stockCount = p.stockCount;
                  isAvailable = p.isAvailable;
                };
                result := Array.append(result, [pub]);
              };
              node := n.1;
            };
          };
        };
        return result;
      };
    };
  };
};
