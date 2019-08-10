const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories");

router.get("/", categoryController.index);

router.get("/add", categoryController.getAddCateogy);

router.get("/:categoryId", categoryController.getProductsByCtegoryId);

router.post("/add", categoryController.postCategories);

module.exports = router;
