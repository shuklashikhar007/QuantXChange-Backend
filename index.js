require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const HoldingsModel = require("./models/HoldingsModels");
const PositionsModel = require("./models/PositionsModel");
const OrdersModel = require("./models/OrdersModel");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");

const PORT = process.env.PORT || 8080;
const MONGODB_ATLAS_URL = process.env.MONGODB_URL;

if (!MONGODB_ATLAS_URL) throw new Error("MONGODB_URL is not set in environment variables");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_ATLAS_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1); // exit on DB failure so Vercel logs it clearly
  });

  app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "QuantXChange API is running 🚀"
  });
});
app.use("/", authRoutes);
app.use("/orders", ordersRoutes);

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
}

module.exports = app;