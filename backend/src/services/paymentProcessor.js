const pool = require("../db");

async function processPayment(paymentId, method) {
  // simulate bank delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const finalStatus = Math.random() > 0.2 ? "success" : "failed";

  await pool.query(
    `UPDATE payments
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [finalStatus, paymentId]
  );

  return finalStatus;
}

module.exports = { processPayment };
