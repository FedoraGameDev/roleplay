const db = require("../models");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    index: (req, res) =>
    {
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                const email = decodedToken.email;
                console.log(decodedToken);
                res.json({ "text": `Hello, ${email}` });
            });
    }
};