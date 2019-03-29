const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: String,
    description: String,
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }],
    genres: [{
        type: Schema.Types.ObjectId,
        ref: "Genre"
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    chapters: [{
        title: String,
        description: String,
        posts: [{
            author: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            description: String
        }]
    }],
    subscribers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    closed_group: Boolean
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;