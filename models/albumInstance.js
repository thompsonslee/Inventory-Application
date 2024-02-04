const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AlbumInstanceSchema = new Schema({
    album: {type: Schema.Types.ObjectId, ref:"Album", required: true},
    status: {
        type: String,
        required: true,
        enum: ["available","ordered"],
        default: "available",
    },
    arrival_date:{type: Date}
})

AlbumInstanceSchema.virtual("url").get(function(){
    return(`/albumInstance/${this._id}`)
})

AlbumInstanceSchema.virtual("formatted_date").get(function(){
    if(this.arrival_date == undefined){
        return
    }
    return(DateTime.fromJSDate(this.arrival_date).toLocaleString(DateTime.DATE_MED))
})

AlbumInstanceSchema.virtual("ISO_date").get(function(){
    if(this.arrival_date == undefined){
        return
    }
    return DateTime.fromJSDate(this.arrival_date).toISODate();
})

module.exports = mongoose.model("Albuminstance", AlbumInstanceSchema)