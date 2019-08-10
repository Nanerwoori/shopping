const Product = require("../models/Product");
const Category = require("../models/Category");
module.exports.home = (req, res, next) => {
  let products = null;
  Product.find({ isPublic: true })
    .then(docProducts => {
      products = docProducts;
      return Category.find();
    })
    .then(categories => {
      res.render("index/home", { pageTitle: "홈", products, categories });
    })
    .catch(err => console.log(err));
};

module.exports.search = (req, res, next) => {
  const searchBy = req.query.searchBy;

  if (
    typeof searchBy !== "string" ||
    (typeof searchBy === "string" && searchBy.length === 0)
  )
    return res.redirect("/");

  Product.find({ name: { $regex: searchBy, $options: "i" } })
    .then(products => {
      res.render("index/search", {
        pageTitle: "search |" + searchBy,
        products,
        searchBy
      });
    })
    .catch(err => console.log(err));
};

module.exports.dashboard = (req, res, next) => {
  Product.find().then(products => {
    res.render("index/dashboard", {
      pageTitle: "대시보드",
      path: "/",
      products: products || []
    });
  });
};
