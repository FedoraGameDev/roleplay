const models = require("../models");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    index: (req, res) =>
    {
        console.log("Retrieving character info...");
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated from firebase.");
                models.User.findOne({ uuid: decodedToken.uid }).populate({ path: "characters", populate: { path: "stories" } })
                    .then((user) =>
                    {
                        console.log(`${user.username} authenticated.`);
                        console.log(`Found ${user.characters.length} characters.`);
                        console.log(user.characters);

                        res.json({ characters: user.characters });
                    })
                    .catch(error =>
                    {
                        res.status(500).json({ "ERROR": error });
                    });
            })
            .catch(error =>
            {
                res.status(500).json({ "ERROR": error });
            });
    }
}