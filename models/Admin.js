const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    requried: true
  },
  password: {
    type: String,
    requried: true
  },
  role: {
    type: String,
    enum: ["admin", "manager", "staff"]
  }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
