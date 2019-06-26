const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

require("./passport");

const app = express();

mongoose
  .connect(keys.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("몽고DB 연결 성공!"))
  .catch(err => console.log(err));

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// static
app.use(express.static(path.join(__dirname, "public")));

// 템플릿
app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(indexRouter);
app.use("/auth", authRouter);

app.listen(5000, () => {
  console.log("서버시작!");
});
