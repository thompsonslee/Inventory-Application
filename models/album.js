const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "artist", required: true },
    description: { type: String},
    release_date: { type: Date, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "genre" }],
    coverImage: { type: Buffer, required: true},
    coverImageType: { type: String, required: true}
})

AlbumSchema.virtual('coverImageGet').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,
        ${this.coverImage.toString('base64')}`
    }
})

AlbumSchema.virtual("url").get(function(){
    return(`/album/${this._id}`)
})

AlbumSchema.virtual("formatted_date").get(function(){
    return(DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED))
})

AlbumSchema.virtual("ISO_date").get(function(){
    return DateTime.fromJSDate(this.release_date).toISODate();
})

module.exports = mongoose.model("Album", AlbumSchema)