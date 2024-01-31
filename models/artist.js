const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
})

ArtistSchema.virtual("url").get(function(){
    return(`/artist/${this._id}`)
})

module.exports = mongoose.model("artist", ArtistSchema)