require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const HoldingsModel = require("./models/HoldingsModels");
const PositionsModel = require("./models/PositionsModel");
const OrdersModel = require("./models/OrdersModel");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8080;
const MONGODB_ATLAS_URL = process.env.MONGODB_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(MONGODB_ATLAS_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.use("/", authRoutes);

app.use("/orders", ordersRoutes);

app.get("/allHoldings", async(req, res)=>{
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async(req, res)=>{
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async(req, res)=>{
  let newOrder = new OrdersModel({
    name: req.body.name, 
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode
  });
  await newOrder.save();
  res.send("Order saved");
});

app.listen(PORT, () => {
  console.log("App is running");
});
