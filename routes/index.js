const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

const { isAmdin } = require("../middleware");

router.get("/", indexController.home);

router.get("/search", indexController.search);

router.get("/dashboard", isAmdin, indexController.dashboard);

module.exports = router;
