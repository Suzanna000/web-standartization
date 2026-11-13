class OrderNotifier {
  async orderAccepted(_email, _order) {
    throw new Error("OrderNotifier.orderAccepted must be implemented");
  }
}

module.exports = { OrderNotifier };
