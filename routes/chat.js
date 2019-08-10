const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");
const { isAuth } = require("../middleware");

// const { isAmdin } = require("../middleware");

module.exports = io => {
  router.get("/", chatController.connect)(io);
  return router;
};
