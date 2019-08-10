const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  price: Number,
  category: new mongoose.Schema({
    name: { type: String, required: true }
  }),
  isPublic: Boolean,
  description: String,
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      body: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
