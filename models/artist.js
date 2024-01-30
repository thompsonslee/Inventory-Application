const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
})

module.exports = mongoose.model("Artist", ArtistSchema)