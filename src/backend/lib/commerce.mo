import CommerceTypes "../types/commerce";
import List "mo:core/List";
import Array "mo:core/Array";

module {
  public func seedCategories(categories : List.List<CommerceTypes.ProductCategory>) {
    let initialCategories : [CommerceTypes.ProductCategory] = [
      {
        id = 1;
        name = "Groceries";
        description = "Daily essentials, rice, flour, etc.";
        image = "grocery.png";
        parentCategoryId = null;
      },
      {
        id = 2;
        name = "Electronics";
        description = "Mobiles, laptops, and accessories";
        image = "electronics.png";
        parentCategoryId = null;
      },
      {
        id = 3;
        name = "Local Shops";
        description = "Nearby general stores";
        image = "local-shops.png";
        parentCategoryId = null;
      },
      {
        id = 4;
        name = "Restaurants";
        description = "Food delivery from local restaurants";
        image = "restaurants.png";
        parentCategoryId = null;
      }
    ];
    for (cat in initialCategories.vals()) {
      List.push(cat, categories);
    };
  };

  public func seedProducts(products : List.List<CommerceTypes.Product>) {
    let initialProducts : [CommerceTypes.Product] = [
      {
        id = 1;
        vendorId = 1; // assuming vendor 1 is a grocery store
        name = "Aashirvaad Atta 5kg";
        description = "Whole wheat chakki atta";
        price = 245;
        mrp = 280;
        images = ["atta.png"];
        categoryIds = [1];
        inStock = true;
        stockCount = 100;
        isAvailable = true;
      },
      {
        id = 2;
        vendorId = 2; // electronics shop
        name = "Fast Charge Cable Type-C";
        description = "20W fast charging cable";
        price = 199;
        mrp = 399;
        images = ["cable.png"];
        categoryIds = [2];
        inStock = true;
        stockCount = 50;
        isAvailable = true;
      }
    ];
    for (prod in initialProducts.vals()) {
      List.push(prod, products);
    };
  };
};
