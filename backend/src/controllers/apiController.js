const db = require("../models");

module.exports = {
    index: (req, res) =>
    {
        res.json({ "text": "Hello!" })
    }
};