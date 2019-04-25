const express = require("express");
const routes = require("./");
const controllers = require("../controllers");

const router = express.Router();

module.exports = router
    .post("/list", controllers.character.index)
    .post("/create", controllers.character.create)
    .post("/view/:character_id", controllers.character.view)
    .post("/update", controllers.character.update)