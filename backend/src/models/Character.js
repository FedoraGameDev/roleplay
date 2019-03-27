const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }]
});

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;