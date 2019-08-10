const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoId: String,
  username: String,
  profileImage: String,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qty: {
          type: Number,
          required: true
        }
      }
    ]
  },
  tokens: [
    {
      kind: String,
      accessToken: String
    }
  ]
});

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.deleteProdcutFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.addToCart = function(product, newQty) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  // let newQty = qty;

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQty = this.cart.items[cartProductIndex].qty + newQty;
    updatedCartItems[cartProductIndex].qty = newQty;
  } else {
    updatedCartItems.push({
      productId: product._id,
      qty: newQty
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;

  return this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;
