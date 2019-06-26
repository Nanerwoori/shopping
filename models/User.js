const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoId: String,
  username: String,
  profileImage: String
});

const User = mongoose.model("user", userSchema);
module.exports = User;
