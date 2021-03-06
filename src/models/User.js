const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO: Add Role
const userSchema = new Schema({
    uuid: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        require: true
    },
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }],
    subscriptions: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }],
    notifications: [{
        title: String,
        description: String,
        link: String
    }],
    roles: [{
        type: String
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;