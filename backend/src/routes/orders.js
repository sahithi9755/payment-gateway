const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pool = require("../db");
const { generateOrderId } = require("../utils/idGenerator");

router.post("/orders", auth, async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = null, notes = {} } = req.body;

    // 1️⃣ Validate amount
    if (!amount || typeof amount !== "number" || amount < 100) {
      return res.status(400).json({
        error: {
          code: "BAD_REQUEST_ERROR",
          description: "Amount must be at least 100"
        }
      });
    }

    // 2️⃣ Generate order ID
    const orderId = generateOrderId();

    // 3️⃣ Insert into DB
    const result = await pool.query(
      `INSERT INTO orders
       (id, merchant_id, amount, currency, receipt, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'created')
       RETURNING *`,
      [
        orderId,
        req.merchant.id,
        amount,
        currency,
        receipt,
        notes
      ]
    );

    // 4️⃣ Respond
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Unable to create order"
      }
    });
  }
});

// 🔍 Get Order by ID
router.get("/orders/:order_id", auth, async (req, res) => {
  try {
    const { order_id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1 AND merchant_id = $2`,
      [order_id, req.merchant.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND_ERROR",
          description: "Order not found"
        }
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Unable to fetch order"
      }
    });
  }
});

module.exports = router;
