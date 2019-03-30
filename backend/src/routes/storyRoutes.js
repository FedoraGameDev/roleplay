const express = require("express");
const routes = require("./");
const controllers = require("../controllers");

const router = express.Router();

module.exports = router
    .get("/:genre", controllers.story.genre)
    .get("/", controllers.story.index)
    .post("/create", controllers.story.create)
    .get("/view/:story_id", controllers.story.story)
    .post("/add_chapter/:story_id", controllers.story.create_chapter)