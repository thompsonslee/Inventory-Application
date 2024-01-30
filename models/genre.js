const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    title: {type: string, required: true}
});

module.exports = mongoose.model("Genre", GenreSchema)
