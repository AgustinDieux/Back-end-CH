// Genera y entrega 100 productos de ejemplo en el mismo formato que entregaría una petición de Mongo
function generateMockProducts() {
  const mockProducts = [];
  for (let i = 0; i < 100; i++) {
    const product = {
      _id: `mock-product-${i}`,
      name: `Mock Product ${i}`,
      price: Math.floor(Math.random() * 100) + 1,
      description: `This is a mock product ${i}`,
    };
    mockProducts.push(product);
  }
  return mockProducts;
}

// Exporta una función que maneje la ruta '/mockingproducts' y devuelva los productos de ejemplo generados
function mockingProductsHandler(req, res) {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
}

module.exports = { generateMockProducts, mockingProductsHandler };
