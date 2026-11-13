const { EmailOrderNotifier } = require("./adapters/EmailOrderNotifier");
const {
  PostgresOrderRepository,
} = require("./adapters/PostgresOrderRepository");
const { CreateOrder } = require("./application/CreateOrder");
const { createOrderHandler } = require("./createOrder");

function buildCreateOrderHandler({ db, smtp }) {
  const repository = new PostgresOrderRepository(db);
  const notifier = new EmailOrderNotifier(smtp);
  const createOrder = new CreateOrder(repository, notifier);

  return createOrderHandler(createOrder);
}

module.exports = { buildCreateOrderHandler };
