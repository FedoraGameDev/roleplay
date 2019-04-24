const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: String,
    description: String,
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }],
    applicantusers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    applicantcharacters: [{
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
                ref: "Character"
            },
            description: String
        }]
    }],
    subscribers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    color: {
        type: String,
        default: "#000000"
    },
    date_created: Date,
    latest_reply_date: Date,
    replies: Number,
    closed_group: Boolean
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;