const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("passport");

/**
 * @method GET:/auth/kakao
 * @desc kakao 요청
 */

router.get(
  "/kakao",
  passport.authenticate("kakao", { failureRedirect: "/auth/login" })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

/**
 * @method GET:/auth/kakao/callback
 * @desc kakao callback
 */

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/auth/login" }),
  authController.kakaoLoginCallback
);

/**
 * @method GET:/auth/login
 * @desc 로그인 폼
 */
//router.get("/login", authController.getLogin);

/**
 * @method POST:/auth/login
 * @desc 로그인 Process
 */
// router.post("/login", authController.postLogin);

/**
 * @method GET:/auth/signup
 * @desc 회원가입 폼
 */
// router.get("/signup", authController.getSignup);

/**
 * @method POST:/auth/signup
 * @desc 회원가입 Process
 */
// router.post("/signup", authController.postSignup);

module.exports = router;
