const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: String,
    basicinfo: {
        age: Number,
        gender: String,
        birthday: Date,
        relationships: String,
        backstory: String,
    },
    appearance: {
        hair: String,
        eyes: String,
        description: String
    },
    personality: {
        traits: String,
        likes: String,
        dislikes: String,
        habits: String,
        quirks: String
    },
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