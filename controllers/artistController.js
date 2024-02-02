const Artist = require('../models/artist')
const Album = require('../models/album')

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

function saveArtistImage(artist, coverEncoded){
    if(coverEncoded == null) return
    const image = JSON.parse(coverEncoded)
    artist.artistImage = new Buffer.from(image.data, 'base64')
    artist.artistImageType =image.type
}

exports.artist_list = asyncHandler( async(req,res,next) => {
    const allArtists = await Artist.find({})

    res.render("artist_list",{
        allArtists: allArtists
    })
})

exports.artist_create_get = asyncHandler( async(req,res,next) => {
    res.render("artist_form.pug",{
        title:"Add Artist"
    })
})

exports.artist_create_post = [
    body("title","title must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    body("description","description must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    
    asyncHandler( async(req,res,next) => {
        const errors = validationResult(req)

        const artist = new Artist({
            title: req.body.title,
            description: req.body.description
        })
        saveArtistImage(artist,req.body.artist_image)

        if(!errors.isEmpty()){
            res.render("artist_form",{
                artist:artist,
                errors:errors
            })
            return
        }
        await artist.save()
        res.redirect(artist.url)
    })
]

exports.artist_delete_get = asyncHandler( async(req,res,next) => {
    const [artist,albums] = await Promise.all([
        Artist.findById(req.params.id),
        Album.find({artist:req.params.id})
    ])
    res.render("artist_delete",{
        artist:artist,
        albums:albums
    })
})

exports.artist_delete_post = asyncHandler( async(req,res,next) => {
    const [artist,albums] = await Promise.all([
        Artist.findById(req.params.id),
        Album.find({artist:req.params.id})
    ])
    if(albums.length){
        res.render("artist_delete",{
            artist:artist,
            albums:albums
        })
        return
    }
    await Artist.findByIdAndDelete(req.body.artistID)
    res.redirect("/artists")
})

exports.artist_update_get = asyncHandler( async(req,res,next) => {
    const artist = await Artist.findById(req.params.id)
    res.render("artist_form.pug",{
        title:"edit Artist",
        artist: artist
    })
})

exports.artist_update_post = [
    body("title","title must not be empty")
    .trim()
    .isLength({min:1})
    .escape(),
    body("description","description must not be empty")
    .trim()
    .isLength({min:1})
    .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)

        const artist = new Artist({
            _id:req.params.id,
            title: req.body.title,
            description: req.body.description
        })
        saveArtistImage(artist,req.body.artist_image)
    
        if(!errors.isEmpty()){
            res.render("artist_form",{
                artist:artist,
                errors:errors
            })
            return
        }
        const newArtist = await Artist.findByIdAndUpdate(req.params.id,artist,{})
        res.redirect(newArtist.url)
    })
]

exports.artist_detail = asyncHandler( async(req,res,next) => {
    const [artist,albums] = await Promise.all([
        Artist.findById(req.params.id),
        Album.find({artist:req.params.id})
    ])
    res.render("artist_detail",{
        artist:artist,
        albums:albums
    })
})