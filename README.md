# Выделение абстракций при создании заказа

Исходная функция одновременно обрабатывала HTTP, рассчитывала заказ,
обращалась к базе данных и отправляла письмо. В решении эти обязанности
разделены:

- `domain/Order.js` — предметная область: проверка позиций, сумма и скидка;
- `application/CreateOrder.js` — сценарий создания заказа;
- `ports/OrderRepository.js` — абстракция сохранения;
- `ports/OrderNotifier.js` — абстракция уведомления;
- `adapters/PostgresOrderRepository.js` — сохранение через PostgreSQL;
- `adapters/EmailOrderNotifier.js` — отправка письма через SMTP;
- `createOrder.js` — только преобразование HTTP-запроса и ответа;
- `index.js` — сборка зависимостей приложения.

Зависимости направлены внутрь: предметная область не знает про HTTP,
PostgreSQL и SMTP. Благодаря этому расчёт заказа и сценарий создания можно
тестировать без сети и базы данных.

## Запуск тестов

```bash
npm test
```

## Подключение обработчика

```js
const { buildCreateOrderHandler } = require("./index");

const createOrder = buildCreateOrderHandler({ db, smtp });
```

