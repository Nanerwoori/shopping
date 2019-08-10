const Category = require("../models/Category");
const Product = require("../models/Product");

module.exports.index = (req, res, next) => {
  res.render("categories/index");
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.postCategories = (req, res, next) => {
  const name = req.body.name;
  // Simple Validation
  console.log(name);
  if (!name || name == "") {
    return res.render("categories/add", { pageTitle: "카테고리 생성" });
  }

  const newCategory = new Category({ name });
  newCategory
    .save()
    .then(() => {
      console.log("카테고리 생성!");
      res.redirect("/dashboard");
    })
    .catch(err => console.log(err));
};

module.exports.getAddCateogy = (req, res, nextg) => {
  res.render("categories/add", {
    pageTitle: "카테고리",
    path: "categories/add"
  });
};

module.exports.getProductsByCtegoryId = (req, res, next) => {
  Product.find({ "category._id": req.params.categoryId.toString() })
    .then(products => {
      res.render("categories/show", {
        pageTitle: "카테고리",
        products
      });
    })
    .catch(err => console.log(err));
};
