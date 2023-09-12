import Product from "../entity/product";
import { ProductService } from "./product.service";


describe('Product Service unit tests', () => {
  it('should change the prices of all products', () => {
    const product1 = new Product("123", "Product One", 10)
    const product2 = new Product("321", "Product Two", 20)

    const products = [product1, product2]

    ProductService.increasePrice(products, 100)

    expect(product1.price).toEqual(20)
    expect(product2.price).toEqual(40)
  });
});