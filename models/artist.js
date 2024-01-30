const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    title: {type: string, required: true},
    description: {type: string, required: true}
})

module.exports = mongoose.model("Artist", ArtistSchema)