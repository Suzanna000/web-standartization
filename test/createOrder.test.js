const assert = require("node:assert/strict");
const test = require("node:test");

const { CreateOrder } = require("../application/CreateOrder");
const { createOrderHandler } = require("../createOrder");
const { EmptyOrderError, Order } = require("../domain/Order");

test("Order calculates total without discount", () => {
  const order = new Order(1, [
    { price: 100, qty: 2 },
    { price: 50, qty: 1 },
  ]);

  assert.equal(order.total, 250);
});

test("Order applies five percent discount above 10000", () => {
  const order = new Order(1, [{ price: 6000, qty: 2 }]);

  assert.equal(order.total, 11400);
});

test("Order rejects an empty item list", () => {
  assert.throws(() => new Order(1, []), EmptyOrderError);
});

test("CreateOrder saves the order and sends notification", async () => {
  const calls = [];
  const repository = {
    async save(order) {
      calls.push(["save", order.userId, order.total]);
    },
  };
  const notifier = {
    async orderAccepted(email, order) {
      calls.push(["notify", email, order.total]);
    },
  };
  const useCase = new CreateOrder(repository, notifier);

  const order = await useCase.execute({
    userId: 7,
    email: "student@example.com",
    items: [{ price: 500, qty: 2 }],
  });

  assert.equal(order.total, 1000);
  assert.deepEqual(calls, [
    ["save", 7, 1000],
    ["notify", "student@example.com", 1000],
  ]);
});

test("HTTP handler delegates work to the use case", async () => {
  const useCase = {
    async execute(command) {
      assert.deepEqual(command, {
        userId: 7,
        email: "student@example.com",
        items: [{ price: 500, qty: 2 }],
      });
      return { total: 1000 };
    },
  };
  const response = createResponse();

  await createOrderHandler(useCase)(
    {
      body: JSON.stringify({ items: [{ price: 500, qty: 2 }] }),
      user: { id: 7, email: "student@example.com" },
    },
    response,
  );

  assert.equal(response.statusCode, 201);
  assert.equal(response.body, JSON.stringify({ total: 1000 }));
});

test("HTTP handler returns 400 for an empty order", async () => {
  const useCase = new CreateOrder(
    { async save() {} },
    { async orderAccepted() {} },
  );
  const response = createResponse();

  await createOrderHandler(useCase)(
    {
      body: JSON.stringify({ items: [] }),
      user: { id: 7, email: "student@example.com" },
    },
    response,
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body, "empty");
});

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}
