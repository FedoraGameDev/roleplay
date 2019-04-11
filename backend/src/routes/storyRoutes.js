const express = require("express");
const routes = require("./");
const controllers = require("../controllers");

const router = express.Router();

module.exports = router
    .get("/list", controllers.story.listStory)
    .get("/genre/list", controllers.story.listGenre)
    .get("/chapter/view/:story_id/:chapter_name", controllers.story.chapter)

    .get("/:genre", controllers.story.genre)
    //.get("/", controllers.story.index)
    .post("/create", controllers.story.create)
    .get("/view/:story_id", controllers.story.story)
    .post("/add_chapter/:story_id", controllers.story.create_chapter)