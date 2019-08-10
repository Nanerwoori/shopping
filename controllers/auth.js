const User = require("../models/User");

module.exports.kakaoVerify = (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  if (req.user) {
    User.findOne({ kakaoId: profile }).then(user => {
      if (user) {
        done(new Error("이미 카카오 아이디가 존재합니다."));
      } else {
        User.findById(req.user.id).then(user => {
          if (!user)
            return done(new Error("카카오 계정을 찾을 수가 없습니다."));
          console.log("카카오 계정이 연동되었습니다.");
          user.kakaoId = profile.id;
          user.username = profile.username;
          user.profileImage =
            profile._json.properties.profile_image ||
            "http://www.accdpa.org/wp-content/uploads/2015/09/placeholder-user-photo-600x543.png";
          user.tokens = user.tokens.push({ kind: "kakao", accessToken });

          user.save(err => {
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ kakaoId: profile.id }).then(user => {
      if (user) {
        done(null, user);
      } else {
        const newUser = new User();
        /**
         * {
          kakaoId: profile.id,
          username: profile.username,
          provider: "kakao",
          profileImage:
            profile._json.properties.profile_image ||
            "http://www.accdpa.org/wp-content/uploads/2015/09/placeholder-user-photo-600x543.png",
          tokens: newUser.tokens.push({ kind: "kakao", accessToken })
        }
         */

        newUser.kakaoId = profile.id;
        newUser.username = profile.username;
        newUser.profileImage =
          profile._json.properties.profile_image ||
          "http://www.accdpa.org/wp-content/uploads/2015/09/placeholder-user-photo-600x543.png";
        newUser.tokens.push({
          kind: "kakao",
          accessToken: accessToken
        });

        newUser.save(err => {
          done(err, newUser);
        });
      }
    });
  }
};

module.exports.kakaoLoginCallback = (req, res, next) => {
  console.log("카카오 로그인 성공!");
  req.flash("success_message", `${req.user.username}계정으로 접속했습니다.`);
  res.redirect(req.session.returnTo);
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
