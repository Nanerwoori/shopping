const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const keys = require("./config/keys");
const User = require("./models/User");
const { kakaoVerify } = require("./controllers/auth");
passport.use(
  new KakaoStrategy(
    {
      clientID: keys.KAKAO.clientID,
      clientSecret: keys.KAKAO.clientSecret,
      callbackURL: keys.KAKAO.callbackURL,
      passReqToCallback: true
    },
    kakaoVerify
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
