const express = require("express");
const routes = require("./");
const controllers = require("../controllers");

const router = express.Router();

module.exports = router
    .post("/", controllers.user.index)
    .post("/create", controllers.user.create)