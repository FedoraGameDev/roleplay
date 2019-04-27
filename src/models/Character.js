const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
{
        name: "",
        basicinfo: {
            age: "",
            gender: "",
            birthmonth: 0,
            birthday: 1,
            relationships: "",
            backstory: ""
        },
        appearance: {
            hair: "#000000",
            eyes: "#000000",
            description: "",
            image: ""
        },
        personality: {
            traits: "",
            likes: "",
            dislikes: "",
            habits: "",
            quirks: ""
        }
    }
    */

const characterSchema = new Schema({
    name: String,
    basicinfo: {
        age: { type: Number, default: 0 },
        gender: { type: String, default: "" },
        birthmonth: { type: Number, default: 0 },
        birthday: { type: Number, default: 0 },
        relationships: { type: String, default: "" },
        backstory: { type: String, default: "" },
    },
    appearance: {
        hair: { type: String, default: "" },
        eyes: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" }
    },
    personality: {
        traits: { type: String, default: "" },
        likes: { type: String, default: "" },
        dislikes: { type: String, default: "" },
        habits: { type: String, default: "" },
        quirks: { type: String, default: "" }
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