const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;