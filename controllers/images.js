const Image = require("../models/Image");

module.exports.postAddSliderImage = (req, res, next) => {
  const {
    body: { title, info },
    file
  } = req;

  const newSlier = new Image({ imagePath: file.path, title, info });
  newSlier.save().then(() => res.redirect("/"));
};

module.exports.getAddSliderImage = (req, res, next) => {
  res.render("images/slider");
};

module.exports.getSliders = (req, res, next) => {
  console.log("getSliders");
  Image.find().then(images => {
    res.json(images);
  });
};
