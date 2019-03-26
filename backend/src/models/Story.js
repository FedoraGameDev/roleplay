const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: String
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;