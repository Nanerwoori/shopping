module.exports.home = (req, res, next) => {
  res.render("index/home", { pageTitle: "홈" });
};
