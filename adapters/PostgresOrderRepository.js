const { OrderRepository } = require("../ports/OrderRepository");

class PostgresOrderRepository extends OrderRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async save(order) {
    await this.db.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2)",
      [order.userId, order.total],
    );
  }
}

module.exports = { PostgresOrderRepository };
