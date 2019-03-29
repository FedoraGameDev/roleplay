const models = require("../models");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    index: (req, res) =>
    {
        console.log("Retrieving Genres...");
        models.Genre.find({})
            .then(genres =>
            {
                console.log(`Returning ${genres.length} Genres.`);
                res.json({ genres: genres });
            })
            .catch(error =>
            {
                console.log(error);
            });
    },
    genre: (req, res) =>
    {
        console.log(`Retrieving Genre ${req.params.genre}...`);
        models.Genre.findOne({ name: req.params.genre }).populate("stories")
            .then(genre =>
            {
                console.log(`Returning Genre ${req.params.genre}. Found ${genre.stories.length} stories.`);
                res.json({ stories: genre.stories });
            })
            .catch(error =>
            {
                console.log(error);
            });
    },
    create: (req, res) =>
    {
        console.log("New story data...");
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated from firebase.");
                models.User.findOne({ uuid: decodedToken.uid })
                    .then(user =>
                    {
                        console.log(`${user.username} authenticated.`);
                        req.body.story.author = user;
                        console.log(req.body.story.genres);

                        models.Genre.find({ "name": { $in: req.body.story.genres } })
                            .then(genres =>
                            {
                                req.body.story.genres = genres.map(genre => mongoose.Types.ObjectId(genre._id));
                                models.Story.create(req.body.story)
                                    .then(newStory =>
                                    {
                                        console.log(`New story "${newStory.title}" created with id ${newStory._id}.`);

                                        genres.forEach(element =>
                                        {
                                            newGenre = element;
                                            newGenre.stories.splice(newGenre.stories.length, 0, newStory);
                                            console.log(`Updating Genre "${newGenre.name}" with story ${newStory.title}`);
                                            models.Genre.updateOne({ "_id": element._id }, newGenre)
                                                .then(updatedGenre =>
                                                {
                                                    console.log(updatedGenre);
                                                })
                                                .catch(error =>
                                                {
                                                    console.log(error);
                                                });
                                        });

                                        res.json({ newStory: newStory });
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
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            });
    },
    story: (req, res) =>
    {
        console.log(`Retrieving story ${req.params.story_id}...`);
        models.Story.findOne({ _id: req.params.story_id }).populate("genres").populate("stories").populate("subscribers").populate("author")
            .then(story =>
            {
                console.log(`Returning story "${story.title}".`);
                res.json({ story: story });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }
};