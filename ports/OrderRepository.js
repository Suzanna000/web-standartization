class OrderRepository {
  async save(_order) {
    throw new Error("OrderRepository.save must be implemented");
  }
}

module.exports = { OrderRepository };
