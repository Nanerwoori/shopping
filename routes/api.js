const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const { isAuth } = require("../middleware");

router.post("/kakao/pay", isAuth, productController.kakaoPay);

/**
 * @method DELETE:/api/product/delete/:productId
 * @desc 삼풍 삭제
 */
router.delete("/product/delete/:productId", productController.deleteProduct);

/**
 * @method POST:/api/product/comments/:productId
 * @desc 상품 댓글
 */
router.post(
  "/product/comments/:productId",
  productController.addProductComment
);

/**
 * @method GET:/api/product/comments/:productId
 * @desc 상품 댓글
 */
router.get(
  "/product/comments/:productId",
  productController.getProductComments
);

/**
 * @method GET:/api/slider
 * @desc 슬라이더 데이터
 */
// router.get("/slider", Image.getSliders);
// router.get("/slider/add", Image.getAddSliderImage);
// router.post("/slider/add", Image.postAddSliderImage);

/**
 * @method POST:/api/cart/update
 */

module.exports = router;
