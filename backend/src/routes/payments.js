const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pool = require("../db");
const { generatePaymentId } = require("../utils/paymentIdGenerator");
const { processPayment } = require("../services/paymentProcessor");

router.post("/payments", auth, async (req, res) => {
  try {
    const { order_id, method, vpa, card_number } = req.body;

    if (!order_id || !method) {
      return res.status(400).json({ error: "order_id and method are required" });
    }

    // 1️⃣ Check order exists & belongs to merchant
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND merchant_id = $2",
      [order_id, req.merchant.id]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 2️⃣ Validate payment method
    if (method === "upi") {
      if (!vpa || !vpa.includes("@")) {
        return res.status(400).json({ error: "Invalid UPI VPA" });
      }
    }

    if (method === "card") {
      if (!card_number || card_number.length < 12) {
        return res.status(400).json({ error: "Invalid card number" });
      }
    }

    // 3️⃣ Create payment
    const paymentId = generatePaymentId();

    // 4️⃣ Simulate async processing
// setTimeout(async () => {
//   const finalStatus = simulateBankProcessing();

//   await pool.query(
//     `UPDATE payments
//      SET status = $1
//      WHERE id = $2`,
//     [finalStatus, paymentId]
//   );

//   console.log(`💳 Payment ${paymentId} ${finalStatus}`);
// }, 2000);

await pool.query(
  `INSERT INTO payments
   (id, order_id, merchant_id, amount, currency, method, status)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    paymentId,
    order_id,
    req.merchant.id,   // ⭐ THIS FIXES EVERYTHING
    orderResult.rows[0].amount,
    "INR",
    method,
    "created"
  ]
);

// 🔥 Fire-and-forget payment processing
processPayment(paymentId, method)
  .then(status => {
    console.log(`💳 Payment ${paymentId} ${status}`);
  })
  .catch(err => {
    console.error("Payment processing error:", err);
  });

// 5️⃣ Immediate response
return res.status(201).json({
  id: paymentId,
  entity: "payment",
  status: "processing"
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
});

// ✅ STEP 10: Get payment by ID
router.get("/payments/:payment_id", auth, async (req, res) => {
  try {
    const { payment_id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM payments
       WHERE id = $1 AND merchant_id = $2`,
      [payment_id, req.merchant.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND_ERROR",
          description: "Payment not found"
        }
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Get payment error:", err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Unable to fetch payment"
      }
    });
  }
});

module.exports = router;
