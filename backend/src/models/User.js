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
        require: true,
        unique: true
    },
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;