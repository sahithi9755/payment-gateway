require("dotenv").config();
require("./src/db");

const express = require("express");
const app = express();

const orderRoutes = require("./src/routes/orders");

app.use(express.json());

const paymentRoutes = require("./src/routes/payments");
app.use("/api/v1", paymentRoutes);

// 👇 MOUNT ONLY api/v1 HERE
app.use("/api/v1", orderRoutes);

app.listen(8000, () => {
  console.log("🚀 Server running on port 8000");
});
