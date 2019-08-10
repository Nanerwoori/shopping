const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const io = require("../socket");

module.exports.getLogin = (req, res, next) => {
  res.render("admin/login", {
    pageTitle: "관리자 로그인"
  });
};

module.exports.postLogin = (req, res, next) => {
  Admin.findOne({ email: req.body.email })
    .then(admin => {
      if (!admin) {
        res.redirect("/admin");
      } else {
        bcrypt.compare(req.body.password, admin.password, (err, isMatch) => {
          if (isMatch) {
            req.session.admin = admin;
            req.session.save(() => {
              res.redirect("/dashboard");
            });
          } else {
            res.redirect("/admin");
          }
        });
      }
    })
    .catch(err => console.log(err));
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/admin");
  });
};
