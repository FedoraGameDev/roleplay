const models = require("../models");
const db = require("../database");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    index: (req, res) =>
    {
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                models.User.findOne({ uuid: decodedToken.uid })
                    .then(currentUser =>
                    {
                        console.log(`User fetch: ${currentUser.username}`);
                        res.json({ data: currentUser });
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    });
            })
            .catch(error =>
            {
                console.log(error);
            });
    },
    create: (req, res) =>
    {
        console.log("Receiving new user...");
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated. Creating in local database.");
                let form = { uuid: decodedToken.uid, username: req.body.username, characters: [] };
                models.User.create(form, (err, newUser) =>
                {
                    console.log(`Operation complete. User '${newUser.username}' created.`);
                    if (err) { res.status(500).json({ "ERROR": err }) }

                    res.json({ data: newUser });
                });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }
};