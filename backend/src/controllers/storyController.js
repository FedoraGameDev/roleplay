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
        models.Genre.findOne({ name: req.params.genre }).populate("stories")
            .then(genre =>
            {
                res.json({ stories: genre.stories });
            })
            .catch(error =>
            {
                console.log(error);
            });
    },
    create: (req, res) =>
    {
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                models.User.findOne({ uuid: decodedToken.uid })
                    .then(user =>
                    {
                        console.log(`${user.username} authenticated.`);
                        models.Story.create(req.body.story, (err, newStory) =>
                        {
                            console.log(`New story created: ${newStory.title}`);
                            if (err) { res.status(500).json({ "ERROR": err }) }

                            res.json({ newStory: newStory });
                        })
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
    story: (req, res) =>
    {
        models.Story.findOne({ _id: req.params.story_id }).populate("genres").populate("stories").populate("subscribers").populate("author")
            .then(story =>
            {
                res.json({ story: story });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }
};