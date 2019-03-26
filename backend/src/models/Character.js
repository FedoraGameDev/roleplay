const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Character = require("./Character");

const characterSchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;