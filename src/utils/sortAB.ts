import ProductType from "../types/product";
import ProductCategoryType from "../types/productCategory";

export function sortAlfabeticallyValue (a: ProductCategoryType ,b: ProductCategoryType) {
  if (a.Value < b.Value) {
    return -1;
  }
  if (a.Value > b.Value) {
    return 1;
  }
  return 0;
}

export function sortAlfabeticallyName (a: ProductType ,b: ProductType) {
  if (a.Name < b.Name) {
    return -1;
  }
  if (a.Name > b.Name) {
    return 1;
  }
  return 0;
}

