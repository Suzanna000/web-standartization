class EmptyOrderError extends Error {
  constructor() {
    super("empty");
    this.name = "EmptyOrderError";
  }
}

class InvalidOrderItemError extends Error {
  constructor() {
    super("invalid item");
    this.name = "InvalidOrderItemError";
  }
}

class Order {
  constructor(userId, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new EmptyOrderError();
    }

    if (
      items.some(
        (item) =>
          !Number.isFinite(item.price) ||
          !Number.isFinite(item.qty) ||
          item.price < 0 ||
          item.qty <= 0,
      )
    ) {
      throw new InvalidOrderItemError();
    }

    this.userId = userId;
    this.items = items.map((item) => ({ ...item }));
    this.total = this.#calculateTotal();
  }

  #calculateTotal() {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    return subtotal > 10000 ? subtotal * 0.95 : subtotal;
  }
}

module.exports = { EmptyOrderError, InvalidOrderItemError, Order };
