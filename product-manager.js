class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return [...this.products];
  }

  addProduct(product) {
    if (this.products.some((p) => p.code === product.code)) {
      throw new Error("Product code already exists");
    }
    product.id = Date.now();
    this.products.push(product);
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

const productManager = new ProductManager();
console.log(productManager.getProducts()); // []

productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
console.log(productManager.getProducts());

productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
