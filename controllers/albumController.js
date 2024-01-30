const Album = require ("../models/album")
const Artist = require ("../models/artist")
const albumInstance = require("../models/albumInstance")
const Genre = require("../models/genre")

const asyncHandler = require("express-async-handler")

exports.index = asyncHandler( async(req,res,next) => {
    const [
        numAlbums,
        numAlbumInstances,
        numArtists,
        numGenres
    ] = await Promise.all([
        Album.countDocuments({}).exec(),
        albumInstance.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec()
    ])
    res.render("index",{
        title: "Vinyl Database",
        numAlbums: numAlbums,
        numAlbumInstances: numAlbumInstances,
        numArtists: numArtists,
        numGenres: numGenres
    })
})

exports.album_list = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_create_get = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_create_post = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_delete_get = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_delete_post = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_update_get = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_update_post = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

exports.album_detail = asyncHandler( async(req,res,next) => {
    res.send("NOT IMPLEMENTED");
})

