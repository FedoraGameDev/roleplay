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
    }
};