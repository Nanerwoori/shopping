const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: Object, required: true },
      qty: { type: Number, required: true }
    }
  ],
  user: {
    username: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
