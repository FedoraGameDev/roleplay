const models = require("../models");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    index: (req, res) =>
    {
        models.Genre.find({})
            .then(genres =>
            {
                res.json({ genres: genres });
            })
            .catch(error =>
            {
                console.log(error);
            });
    },
    genre: (req, res) =>
    {
        console.log(req.params.genre);
        models.Genre.findOne({ name: req.params.genre }).populate("stories")
            .then(genre =>
            {
                res.json({ stories: genre.stories });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }
};