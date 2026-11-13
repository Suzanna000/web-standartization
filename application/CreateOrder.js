const { Order } = require("../domain/Order");

class CreateOrder {
  constructor(orderRepository, orderNotifier) {
    this.orderRepository = orderRepository;
    this.orderNotifier = orderNotifier;
  }

  async execute({ userId, email, items }) {
    const order = new Order(userId, items);

    await this.orderRepository.save(order);
    await this.orderNotifier.orderAccepted(email, order);

    return order;
  }
}

module.exports = { CreateOrder };
