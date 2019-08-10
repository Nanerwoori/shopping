const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imagePath: String,
  title: String,
  info: String
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
