const {model} = require("mongoose");
const userSchema = require("../schemas/UserSchema");

const User = model("User", userSchema);

module.exports = User;