const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function waitForDB(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Database connected");
      return;
    } catch (err) {
      console.log(`⏳ Waiting for DB... (${i}/${retries})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("❌ Database not ready after retries");
}

async function seedMerchant() {
  await waitForDB();

  const result = await pool.query(
    `SELECT id FROM merchants WHERE api_key = $1`,
    ["key_test_abc123"]
  );

  if (result.rows.length === 0) {
    await pool.query(
      `INSERT INTO merchants (id, name, email, api_key, api_secret, is_active)
       VALUES ($1,$2,$3,$4,$5,true)`,
      [
        "b4ea4c54-a5d6-40b4-9713-df00b6f225f0",
        "Test Merchant",
        "test@merchant.com",
        "key_test_abc123",
        "secret_test_xyz789"
      ]
    );
    console.log("✅ Test merchant seeded");
  } else {
    console.log("ℹ️ Test merchant already exists");
  }
}

seedMerchant();

module.exports = pool;
