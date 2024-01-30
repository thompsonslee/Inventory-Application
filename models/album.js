const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "artist", required: true },
    description: { type: String, requred: true},
    release_date: { type: Date, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "genre" }],
})

module.exports = mongoose.model("Album", AlbumSchema)