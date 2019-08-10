const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const { isAuth, isAmdin } = require("../middleware");

/**
 * @method GET:/products/add
 * @desc 상품 등록 폼
 */
router.get("/add", isAmdin, productController.getAddProduct);

/**
 * @method GET:/products/detail/:productId
 * @desc 상품 자세히 보기
 */
router.get("/detail/:productId", productController.detail);

/**
 * @method GET:/products/cart
 * @desc 상품 자세히 보기
 */
router.get("/cart", isAuth, productController.getCart);

/**
 * @method POST:/products/add
 * @desc 상품 등록 process
 */
router.post("/add", isAmdin, productController.postAddProduct);

/**
 * @method POST:/products/add-cart
 * @desc 상품 등록 process
 */
router.post("/add/cart", isAuth, productController.postAddToCart);
router.post("/delete/cart", isAuth, productController.deleteCartProduct);
router.get("/clear/cart", isAuth, productController.clearCart);

router.post("/create-order", isAuth, productController.postOrder);
router.get("/orders", isAuth, productController.getOrders);
module.exports = router;
