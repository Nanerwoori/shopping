// const https = require("https");
// const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Category = require("./models/Category");
const multer = require("multer");

require("./passport");

const app = express();
// const http = require("http").createServer(app);
// const io = require("./socket.js").init(http);

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

mongoose
  .connect(keys.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("몽고DB 연결 성공!"))
  .catch(err => console.log(err));

const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const categoryRouter = require("./routes/category");
const apiRouter = require("./routes/api");

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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(
//   express.static(path.join(__dirname, "node_modules", "socket.io-client"))
// );

// 템플릿
app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "slider-" + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  ["image/jpeg", "image/jpg", "image/png"].indexOf(file.mimetype) === -1
    ? cb(null, false)
    : cb(null, true);
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.admin = req.session.admin || null;
  Category.find()
    .then(categories => {
      if (categories) {
        res.locals.categories = categories || [];
      }
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  if (req.session.admin) {
    req.admin = req.session.admin;
    next();
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (!req.user) {
    return next();
  }
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.numOfCart = req.user.cart.items.length;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

/**Flash Message Middleware */
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message") || null;
  res.locals.fail_message = req.flash("fail_message") || null;
  next();
});

/**Redirect Middlware*/
app.use((req, res, next) => {
  if (!req.user && !req.path.match(/^\/auth/) && !req.path.match(/^\/api/)) {
    req.session.returnTo = req.originalUrl;
  }
  next();
  console.log(req.user);
});

app.use(indexRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

/**
 * 
 app.get("/chat", (req, res, next) => {
   User.findById
   io.on("connection", socket => {
     console.log("소켓 연결");
     
     socket.on("send", data => {
       console.log(data);
       
       socket.emit("user", { user: req.user });
      });
    });
  });
   */

// https
// .createServer({ key: privateKey, cert: certificate }, app)
app.listen(5000, () => {
  console.log("서버시작!");
});
