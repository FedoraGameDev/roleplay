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
    },
    create: (req, res) =>
    {
        console.log("New Character received...")
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated through firebase...");
                models.User.findOne({ uuid: decodedToken.uid })
                    .then(user =>
                    {
                        console.log(`${user.username} authenticated. Creating new character...`);
                        characterDoc = req.body.character;
                        characterDoc.user = user;
                        models.Character.create(characterDoc, (err, character) =>
                        {
                            if (err) { res.status(500).json({ "ERROR": err }) };

                            console.log(`Character ${characterDoc.name} created!`);

                            models.User.updateOne({ _id: user._id }, { $push: { characters: character } }, (err, output) =>
                            {
                                if (err) { res.status(500).json({ "ERROR": err }) };

                                console.log("User Updated.");

                                res.json({ "character": character });
                            })
                        })
                    })
                    .catch(error =>
                    {
                        res.status(500).json({ "ERROR": error });
                    });
            })
    },
    view: (req, res) =>
    {
        console.log("Retrieving character...");
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated through firebase...");

                models.Character.findOne({ _id: req.params.character_id }, (err, character) =>
                {
                    if (err) { res.status(500).json({ "ERROR": err }) };

                    console.log(`Character "${character.name}" found.`);
                    res.json({ "character": character });
                });
            })
            .catch(error =>
            {
                res.status(500).json({ "ERROR": error });
            });
    }
}