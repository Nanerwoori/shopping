const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

/**
 * @method GET:/admin
 * @desc 관리자 로그인 폼
 */
router.get("/", adminController.getLogin);
router.post("/", adminController.postLogin);
router.post("/logout", adminController.postLogout);

module.exports = router;
