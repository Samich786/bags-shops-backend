const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  role: String,
  cartId: {  // Changed from cartsId to cartId to represent a single cart reference
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",  // Make sure this matches the cart model's name
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order", // Assuming you have an order model
    },
  ],
  contact: Number,
  picture: String,
});

module.exports = mongoose.model("user", userSchema);
