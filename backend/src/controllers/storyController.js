const models = require("../models");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");

module.exports = {
    listStory: (req, res) =>
    {
        console.log("Retrieving Stories...");
        models.Story.find({}).populate("author")
            .then(stories =>
            {
                console.log(`Returning ${stories.length} Stories.`);
                res.json({ stories: stories });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            });
    },

    listGenre: (req, res) =>
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
                res.status(500).json({ "ERROR": error });
            });
    },

    story: (req, res) =>
    {
        console.log(`Retrieving story ${req.params.story_id}...`);
        models.Story.findOne({ _id: req.params.story_id }).populate("genres").populate("subscribers").populate("author")
            .then(story =>
            {
                console.log(`Returning story "${story.title}".`);
                res.json({ story: story });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            });
    },

    chapter: (req, res) =>
    {
        console.log(`Retrieving chapter ${req.params.story_id}/${req.params.chapter_name}`);
        models.Story.findOne({ _id: req.params.story_id }).populate("chapters.posts.author")
            .then(story =>
            {
                console.log(`Returning chapter "${story.chapters[req.params.chapter_name].description}"`);
                res.json({ chapter: story.chapters[req.params.chapter_name] });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            })
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
                models.User.findOne({ uuid: decodedToken.uid }, (err, user) =>
                {
                    if (err) { res.status(500).json({ "ERROR": err }); };

                    console.log(`${user.username} authenticated.`);
                    req.body.story.author = user;

                    models.Genre.find({ "name": { $in: req.body.story.genres } }, (err, genres) =>
                    {
                        if (err) { res.status(500).json({ "ERROR": err }); };
                        req.body.story.genres = genres.map(genre => mongoose.Types.ObjectId(genre._id));
                        models.Story.create(req.body.story, (err, newStory) =>
                        {
                            if (err) { res.status(500).json({ "ERROR": err }); };

                            console.log(`New story "${newStory.title}" created with id ${newStory._id}.`);

                            models.User.updateOne({ uuid: decodedToken.uid }, { $push: { stories: newStory } }, (err, updatedUser) =>
                            {
                                if (err) { res.status(500).json({ "ERROR": err }); };

                                res.json({ newStory: newStory });
                            });
                        });
                    });
                });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            });
    },
    create_chapter: (req, res) =>
    {
        console.log(`Retrieving chapter for story "${req.body.story.title}"`);
        firebaseAdmin.auth().verifyIdToken(req.body.token)
            .then(decodedToken =>
            {
                console.log("User authenticated from firebase.");
                models.User.findOne({ uuid: decodedToken.uid }, (err, user) =>
                {
                    if (err) { res.status(500).json({ "ERROR": err }); };
                    console.log(`User "${user.username}" authenticated.`);

                    console.log(req.body.story._id);

                    models.Story.updateOne({ _id: req.body.story._id }, { $push: { chapters: req.body.chapter } }, (err, updatedStory) =>
                    {
                        if (err) { res.status(500).json({ "ERROR": err }) };

                        console.log("Story updated with new chapter.");
                        res.json({ updatedStory: updatedStory });
                    });
                });
            })
            .catch(error =>
            {
                console.log(error);
                res.status(500).json({ "ERROR": error });
            })
    }
};