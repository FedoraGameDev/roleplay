const express = require("express");
const routes = require("./");
const controllers = require("../controllers");

const router = express.Router();

module.exports = router
    .get("/:genre", controllers.story.genre)
    .get("/", controllers.story.index)