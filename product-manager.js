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

  updateProduct(id, product) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    const productToUpdate = { ...this.products[productIndex], ...product };
    productToUpdate.id = id;
    this.products[productIndex] = productToUpdate;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(productIndex, 1);
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

const productId = productManager.getProducts()[0].id;
console.log(productManager.getProductById(productId));

productManager.updateProduct(productId, { title: "Nuevo título" });
console.log(productManager.getProducts());

productManager.deleteProduct(productId);
console.log(productManager.getProducts());
