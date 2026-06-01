const {Schema} = require("mongoose");

const HoldingsSchema = new Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});
/*yaha pe check for errors later on */
module.exports = {HoldingsSchema};