const models = require("../models");
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

        models.Character.findOne({ _id: req.params.character_id }, (err, character) =>
        {
            if (err) { res.status(500).json({ "ERROR": err }) };

            console.log(`Character "${character.name}" found.`);
            res.json({ "character": character });
        });
    },
    update: (req, res) =>
    {
        console.log("Updating Character...");

        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated through firebase...");
                models.User.findOne({ uuid: decodedToken.uid })
                    .then(user =>
                    {
                        console.log(`User ${user.username} authenticated...`);
                        models.Character.findOne({ _id: req.body.character._id }).populate("user")
                            .then(character =>
                            {
                                console.log(`Character ${character.name} found...`);
                                console.log(`${character.user._id} === ${user._id}: ${`${character.user._id}` === `${user._id}`}`);
                                if (`${character.user._id}` === `${user._id}`)
                                {
                                    let modifiedCharacter = {
                                        name: `${character.name}`,
                                        basicinfo: { ...character.basicinfo },
                                        appearance: { ...character.appearance },
                                        personality: { ...character.personality },
                                        _id: character._id
                                    };
                                    const basicLines = ["age", "gender", "birthmonth", "birthday", "relationships", "backstory"];
                                    const appearanceLines = ["hair", "eyes", "description", "image"];
                                    const personalityLines = ["traits", "likes", "dislikes", "habits", "quirks"];

                                    if (req.body.character.name)
                                        modifiedCharacter.name = req.body.character.name;

                                    if (req.body.character.basicinfo)
                                    {
                                        basicLines.forEach(element =>
                                        {
                                            if (req.body.character.basicinfo[element])
                                                modifiedCharacter.basicinfo[element] = req.body.character.basicinfo[element];
                                        });
                                    }

                                    if (req.body.character.appearance)
                                    {
                                        appearanceLines.forEach(element =>
                                        {
                                            if (req.body.character.appearance[element])
                                                modifiedCharacter.appearance[element] = req.body.character.appearance[element];
                                        });
                                    }

                                    if (req.body.character.personality)
                                    {
                                        personalityLines.forEach(element =>
                                        {
                                            if (req.body.character.personality[element])
                                                modifiedCharacter.personality[element] = req.body.character.personality[element];
                                        })
                                    }

                                    models.Character.updateOne({ _id: character._id }, { $set: modifiedCharacter }, (err, modifyMessage) =>
                                    {
                                        if (err) { res.status(500).json({ "ERROR": err }) };

                                        console.log(`Character "${character.name}" modified.`);
                                        res.json({ "message": modifyMessage });
                                    })
                                }
                                else
                                {
                                    const message = `User "${user.username}" attempted modification of character owned by "${character.user.username}".`;
                                    console.log(message);
                                    res.status(500).json({ "ERROR": message });
                                }
                            })
                            .catch(error =>
                            {
                                console.log(error);
                                res.status(500).json({ "ERROR": error });
                            });
                    })
                    .catch(error =>
                    {
                        console.log(error);
                        res.status(500).json({ "ERROR": error });
                    });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            });
    }
}