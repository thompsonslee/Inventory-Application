const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    artistImage: { type: Buffer, required: true},
    artistImageType: { type: String, required: true},
})
ArtistSchema.virtual('artistImageGet').get(function(){
    if(this.artistImage != null && this.artistImageType != null){
        return `data:${this.artistImageType};charset=utf-8;base64,
        ${this.artistImage.toString('base64')}`
    }
})

ArtistSchema.virtual("url").get(function(){
    return(`/artist/${this._id}`)
})


module.exports = mongoose.model("artist", ArtistSchema)