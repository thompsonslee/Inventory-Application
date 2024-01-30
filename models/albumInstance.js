const mongoose = require("mongoose");

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

module.exports = mongoose.model("Albuminstance", AlbumInstanceSchema)