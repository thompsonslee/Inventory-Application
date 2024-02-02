const Album = require ("../models/album")
const Artist = require ("../models/artist")
const albumInstance = require("../models/albumInstance")
const Genre = require("../models/genre")
const { body, validationResult } = require("express-validator")

const asyncHandler = require("express-async-handler")

function saveCover(album, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    album.coverImage = new Buffer.from(cover.data, 'base64')
    album.coverImageType =cover.type
}

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
    const allAlbums = await Album.find({}, 'title artist')
        .sort({title: 1})
        .populate("artist")
        .exec();

    res.render("album_List", {
        title: "Albums",
        allAlbums: allAlbums
    })
})

exports.album_create_get = asyncHandler( async(req,res,next) => {
    const [allArtists,allGenres] = await Promise.all([
        Artist.find().sort({title: 1}).exec(),
        Genre.find().sort({title:1}).exec()
    ])

    res.render("album_form",{
        title: "Add Album",
        allArtists: allArtists,
        allGenres: allGenres,
    })
})

exports.album_create_post =[
    (req, res, next) =>{
        if(!Array.isArray(req.body.genre)){
            req.body.genre =
            typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next()
    },

    body("title","Title must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("artist","Artist must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("description","Description must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("release_date", "Release date must not be empty")
        .toDate(),
    body("genre")
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)

        const album = new Album({
            title: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            release_date: req.body.release_date,
            genre: req.body.genre
        })
        saveCover(album,req.body.album_cover)

        if(!errors.isEmpty()){
            const [allArtists,allGenres] = await Promise.all([
                Artist.find().sort({title: 1}).exec(),
                Genre.find().sort({title:1}).exec()
            ])
            for(const genre of allGenres){
                if (album.genre.includes(genre._id)){
                    genre.checked = true;
                }
            }
            res.render("album_form",{
                title: "Add Album",
                allArtists: allArtists,
                allGenres: allGenres,
                album: album,
                errors: errors.array(),
            })
        }
        
        else{
            await album.save()
            res.redirect(album.url)
        }
    })
]

exports.album_delete_get = asyncHandler( async(req,res,next) => {
    const [album,albumInstances] = await Promise.all([
        Album.findById(req.params.id),
        albumInstance.find({book: req.params.id})
    ])
    res.render("album_delete",{
        album: album,
        albumInstances: albumInstances
    })
})

exports.album_delete_post = asyncHandler( async(req,res,next) => {
    const [album,albumInstances] = await Promise.all([
        Album.findById(req.params.id).exec(),
        albumInstance.find({book:req.params.id})
    ])
    if(albumInstances > 0){
        res.render("album_delete", {
            album: album,
            albumInstances: albumInstances
        })
        return
    }
    await Album.findByIdAndDelete(req.body.albumID);
    res.redirect("/albums")
})

exports.album_update_get = asyncHandler( async(req,res,next) => {
    const [album,allArtists,allGenres] = await Promise.all([
        Album.findById(req.params.id),
        Artist.find().sort({title: 1}).exec(),
        Genre.find().sort({title:1}).exec()
    ])
    if(album === null){
        const err = new Error("Album not found");
        err.status = 404;
        return next(err);
    }

    allGenres.forEach((genre) => {
        if(album.genre.includes(genre._id)) genre.checked = true; 
    })
    res.render("album_form",{
        title: "edit Album",
        allArtists: allArtists,
        allGenres: allGenres,
        album: album
    })
})

exports.album_update_post =[
    (req, res, next) =>{
        if(!Array.isArray(req.body.genre)){
            req.body.genre =
            typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next()
    },

    body("title","Title must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("artist","Artist must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("description","Description must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("release_date", "Release date must not be empty")
        .toDate(),
    body("genre")
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)

        const album = new Album({
            _id: req.params.id,
            title: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            release_date: req.body.release_date,
            genre: req.body.genre
        })
        saveCover(album,req.body.album_cover)
        if(!errors.isEmpty()){
            console.log("there are errors")
            const [allArtists,allGenres] = await Promise.all([
                Artist.find().sort({title: 1}).exec(),
                Genre.find().sort({title:1}).exec()
            ])
            for(const genre of allGenres){
                if (album.genre.includes(genre._id)){
                    genre.checked = true;
                }
            }
            res.render("album_form",{
                title: "Add Album",
                allArtists: allArtists,
                allGenres: allGenres,
                album: album,
                errors: errors.array(),
            })
        }
        
        else{
            const newAlbum = await Album.findByIdAndUpdate(req.params.id,album,{});
            res.redirect(newAlbum.url)
        }
    })
]

exports.album_detail = asyncHandler( async(req,res,next) => {
    console.log(req.params.id)
    const [album,albumInstances] = await Promise.all([
        Album.findById(req.params.id)
        .populate("artist")
        .exec(),

        albumInstance.find({book:req.params._id})
            .exec()
    ])
    res.render("album_detail",{
        title: album.title,
        album: album,
        albumInstances: albumInstances
    })
})

