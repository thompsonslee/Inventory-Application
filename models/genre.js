const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    title: {type: String, required: true}
});

module.exports = mongoose.model("Genre", GenreSchema)
