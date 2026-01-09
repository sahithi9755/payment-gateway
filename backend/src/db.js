const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedMerchant() {
  const email = "test@example.com";

  const result = await pool.query(
    "SELECT id FROM merchants WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    await pool.query(
      `INSERT INTO merchants (name, email, api_key, api_secret)
       VALUES ($1, $2, $3, $4)`,
      ["Test Merchant", email, "key_test_abc123", "secret_test_xyz789"]
    );
    console.log("✅ Test merchant seeded");
  } else {
    console.log("ℹ️ Test merchant already exists");
  }
}

seedMerchant().catch(console.error);

module.exports = pool;
