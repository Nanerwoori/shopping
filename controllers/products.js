const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Category = require("../models/Category");
const axios = require("axios");
const qs = require("querystring");

module.exports.getAddProduct = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.render("products/add", {
        pageTitle: "상품 등록",
        path: "/products/add",
        categories: categories
      });
    })
    .catch(err => console.log(err));
};

module.exports.postAddProduct = (req, res, next) => {
  /**@todo:  validating input data  */

  console.log("req.body : ", req.body);

  req.body.isPublic = req.body.isPublic === "on" ? true : false;

  Category.findById(req.body.categoryId).then(category => {
    const newProduct = new Product({ ...req.body, category: category });
    newProduct
      .save()
      .then(product => {
        console.log("새로운 상품 등록 성공!");
        res.redirect("/dashboard");
      })
      .catch(err => console.log(err));
  });
};

module.exports.fetchAll = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("index/home", { products: products });
    })
    .catch(err => console.log(err));
};

module.exports.detail = (req, res, next) => {
  Category.find().then(categories => {
    Product.findById(req.params.productId)
      .then(product => {
        if (product) {
          res.render("products/detail", {
            pageTitle: "detail | " + product.name,
            product,
            categories
          });
        } else {
          console.log("상품을 찾을수가 없습니다.");
          res.redirect("/");
        }
      })
      .catch(err => console.log(err));
  });
};

module.exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  const qty = parseInt(req.body.qty);

  console.log("qty : ", qty);

  Product.findById(productId).then(product => {
    if (isNaN(qty) || qty <= 0) {
      console.log("수량 오류 !!");

      return res.render("products/detail", {
        pageTitle: "detail | " + product.name,
        product
      });
    }
    User.findById(req.user._id)
      .then(user => {
        return user.addToCart(product, qty);
      })
      .then(result => {
        res.redirect("/");
      })
      .catch(err => console.log(err));
  });
};

module.exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      console.log(user);
      const products = user.cart.items;
      console.log(products);
      products.forEach(p => {
        console.log(p);
      });
      res.render("products/cart", {
        pageTitle: "MY카트",
        products: products
      });
    })
    .catch(err => console.log(err));
};

module.exports.deleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;

  console.log("productId : ", productId);
  req.user
    .deleteProdcutFromCart(productId)
    .then(() => {
      console.log("카트 아이테 삭제");
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

module.exports.clearCart = (req, res, next) => {
  User.findById(req.user._id).then(user => {
    if (user) {
      user.clearCart().then(() => {
        console.log("Cleared 카트!");
        res.redirect("/");
      });
    } else {
      console.log("유저를 찾을수 없어용");
    }
  });
};

module.exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          qty: item.qty,
          product: { ...item.productId._doc }
        };
      });

      const order = new Order({
        products: products,
        user: {
          username: req.user.username,
          userId: req.user._id
        }
      });

      console.log("[postOrders] order: ", order);
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/products//orders");
    })
    .catch(err => console.log(err));
};

module.exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      console.log("[getOrders] orders : ", orders);
      res.render("products/orders", {
        pageTitle: "주문",
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

module.exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.deleteOne({ _id: productId })
    .then(({ deletedCount }) => {
      if (deletedCount === 0) {
        throw new Error("상품을 찾을수 없어요.");
      }
      // TODO :  DELETE IMAGE FILE ON THE SERVER!

      console.log("상품 삭제");
      res.json({
        message: "상품을 삭제 했어요."
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "상품을 삭제 하지 못했어요." });
    });
};

module.exports.getProductComments = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .populate("comments.userId")
    .select("comments")
    .then(comments => {
      console.log(comments);
      if (comments) {
        res.json(comments);
      } else {
        res.status(404).json({ message: "해당 상품을 찾을수가 없습니다." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "댓글을 불러 올수 없습니다." });
    });
};

module.exports.addProductComment = (req, res, next) => {
  if (!req.user) return res.json({ message: "로그인 해주세요" });
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      console.log(product);
      if (product) {
        const body = req.body.body;
        product.comments.unshift({
          userId: req.user._id,
          body: body
        });

        product
          .save()
          .then(result => {
            res.json({ message: "댓글이 저장 됬습니다.", body: body });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              message: "댓글 저장중 문제 발생했습니다. 다시 시도해주세요"
            });
          });
      } else {
        res.status(404).json({ message: "해당 삼푸을 찾을수가 없습니다." });
      }
    })
    .catch(err => next(err));
};

/**
 * curl -v -X POST 'https://kapi.kakao.com/v1/payment/ready' \
-H 'Authorization: KakaoAK xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-urlencode 'cid=TC0ONETIME' \
--data-urlencode 'partner_order_id=partner_order_id' \
--data-urlencode 'partner_user_id=partner_user_id' \
--data-urlencode 'item_name=초코파이' \
--data-urlencode 'quantity=1' \
--data-urlencode 'total_amount=2200' \
--data-urlencode 'vat_amount=200' \
--data-urlencode 'tax_free_amount=0' \
--data-urlencode 'approval_url=https://developers.kakao.com/success' \
--data-urlencode 'fail_url=https://developers.kakao.com/fail' \
--data-urlencode 'cancel_url=https://developers.kakao.com/cancel'
 */

module.exports.kakaoPay = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === "kakao");
  const { name, qty, price } = req.body;

  console.log(req.body);

  const data = {
    cid: "TC0ONETIME",
    partner_order_id: "partner_order_id",
    partner_user_id: "partner_user_id",
    item_name: "초코파이",
    quantity: 1,
    total_amount: 500,
    tax_free_amount: 0,
    approval_url: "http://localhost:5000/api/kakao/pay/success",
    cancel_url: "http://localhost:5000/api/kakao/pay/cancel",
    fail_url: "http://localhost:5000/api/kakao/pay/fail"
  };
  axios({
    url: "https://kapi.kakao.com/v1/payment/ready",
    method: "post",
    headers: {
      Authorization: "Bearer " + token.accessToken,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    data: qs.stringify(data)
  })
    .then(response => {
      console.log(response);

      res.redirect(response.next_redirect_pc_url);
    })
    .catch(err => {
      console.log(err);
      res.redirect("/products/cart");
    });
};
