export function validateProduct(product: any): boolean {
  const validProduct =
    product.name &&
    product.description &&
    product.price &&
    product.stock &&
    product.imgUrl;
  return validProduct;
}
