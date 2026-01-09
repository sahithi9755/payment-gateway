const pool = require("../db");

function generateOrderId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "order_";
  for (let i = 0; i < 16; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function createOrder(req, res) {
  const { amount, currency = "INR", receipt = null, notes = null } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "Amount must be at least 100",
      },
    });
  }

  try {
    const orderId = generateOrderId();

    const result = await pool.query(
      `INSERT INTO orders
       (id, merchant_id, amount, currency, receipt, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        orderId,
        req.merchant.id,
        amount,
        currency,
        receipt,
        notes,
        "created",
      ]
    );

    const order = result.rows[0];

    res.status(201).json({
      id: order.id,
      entity: "order",
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
      created_at: order.created_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        description: "Could not create order",
      },
    });
  }
}

module.exports = { createOrder };
