const pool = require("../db");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const apiKey = req.header("X-Api-Key");
    const apiSecret = req.header("X-Api-Secret");

    // 1️⃣ Check headers present
    if (!apiKey || !apiSecret) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_ERROR",
          description: "Missing API credentials"
        }
      });
    }

    // 2️⃣ Check merchant in DB
    const result = await pool.query(
      `SELECT id, name, email
       FROM merchants
       WHERE api_key = $1 AND api_secret = $2 AND is_active = true`,
      [apiKey, apiSecret]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_ERROR",
          description: "Invalid API credentials"
        }
      });
    }

    // 3️⃣ Attach merchant to request
    req.merchant = result.rows[0];

    next(); // ✅ allow request
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Authentication failed"
      }
    });
  }
};
