const { OrderNotifier } = require("../ports/OrderNotifier");

class EmailOrderNotifier extends OrderNotifier {
  constructor(smtp) {
    super();
    this.smtp = smtp;
  }

  async orderAccepted(email, _order) {
    await this.smtp.send(email, "Заказ принят");
  }
}

module.exports = { EmailOrderNotifier };
