const User = require("./models/User");
const Admin = require("./models/Admin");
const io = require("./socket");

const isAmdin = (req, res, next) => {
  if (req.admin) {
    Admin.findById(req.admin._id).then(admin => {
      if (admin) {
        req.admin = admin;
      }
      next();
    });
  } else {
    res.redirect("/admin");
  }
};

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .then(user => {
        console.log(user);
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        // console.log(err)
        // throw new Error(err);
        next(new Error(err));
      });
  } else {
    res.redirect("/");
  }
};

module.exports.isAuth = isAuth;
module.exports.isAmdin = isAmdin;
