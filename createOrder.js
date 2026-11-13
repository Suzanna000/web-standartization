const {
  EmptyOrderError,
  InvalidOrderItemError,
} = require("./domain/Order");

function createOrderHandler(createOrder) {
  return async function handleCreateOrder(req, res) {
    let body;

    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (_error) {
      return res.status(400).send("invalid json");
    }

    try {
      const order = await createOrder.execute({
        userId: req.user.id,
        email: req.user.email,
        items: body?.items,
      });

      return res.status(201).send(JSON.stringify({ total: order.total }));
    } catch (error) {
      if (
        error instanceof EmptyOrderError ||
        error instanceof InvalidOrderItemError
      ) {
        return res.status(400).send(error.message);
      }

      throw error;
    }
  };
}

module.exports = { createOrderHandler };