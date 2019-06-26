const User = require("../models/User");

module.exports.kakaoVerify = (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  User.findOne({ kakaoId: profile.id }).then(user => {
    if (user) {
      console.log("기존 유저");
      done(null, user);
    } else {
      console.log("새로운 유저");
      const newUser = new User({
        kakaoId: profile.id,
        username: profile.username,
        provider: "kakao",
        profileImage: profile._json.properties.profile_image
      });
      newUser.save().then(() => done(null, newUser));
    }
  });
};

module.exports.kakaoLoginCallback = (req, res, next) => {
  console.log("카카오 로그인 성공!");
  console.log(req);
  res.redirect("/auth/login");
};

/**
// Display Login Form
module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "로그인"
  });
};

// Process Login
module.exports.postLogin = (req, res, next) => {
  res.send("continue >>>>");
};

// Display Singup Form
module.exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "회원가입"
  });
};

// Process sign up
module.exports.postSignup = (req, res, next) => {
  res.send("continue >>>>");
};

 */
