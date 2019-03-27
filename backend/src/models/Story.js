const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: String,
    description: String,
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
    }]
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;