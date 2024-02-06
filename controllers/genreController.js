const Genre = require("../models/genre")
const Album = require("../models/album")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

exports.genre_list = asyncHandler( async(req,res,next) => {
    const genres = await Genre.find({}).sort({title: 1}).exec();

    res.render("genre_list",{
        title: "Genres",
        genres: genres
    })
})

exports.genre_create_get = asyncHandler( async(req,res,next) => {
    res.render("genre_form",{
        title: "Add Genre"
    })
})

exports.genre_create_post =[
    body("title","must not be empty")
        .trim()
        .isLength({min:1})
        .escape(),
    asyncHandler( async(req,res,next) => {
        const errors = validationResult(req)

        const genre = new Genre({
            title: req.body.title
        })
        if(!errors.isEmpty()){
            res.render("genre_form",{
                title: "Add Genre",
                genre: genre,
                errors: errors
            })
            return
        }
        await genre.save()
        res.redirect(genre.url)
    })
]

exports.genre_delete_get = asyncHandler( async(req,res,next) => {
    const [albums,genre] = await Promise.all([
        Album.find({genre:req.params.id}),
        Genre.findById(req.params.id)
    ])

    res.render("genre_delete",{
        title:"Delete Genre",
        genre: genre,
        albums: albums
    })
})

exports.genre_delete_post = asyncHandler( async(req,res,next) => {
    const [albums,genre] = await Promise.all([
        Album.find({genre:req.params.id}),
        Genre.findById(req.params.id)
    ])
    if(albums.length){
        res.render("genre_delete",{
            title:"Delete Genre",
            genre: genre,
            albums: albums
        })
        return
    }
    await Genre.findByIdAndDelete(req.body.genreID)
    res.redirect("/genres")
})

exports.genre_update_get = asyncHandler( async(req,res,next) => {
    const genre = await Genre.findById(req.params.id)

    res.render("genre_form",{
        title: "Update Genre",
        genre: genre
    })
})

exports.genre_update_post = [
    body("title", "must contain title")
        .trim()
        .isLength({min:1})
        .escape(),
    asyncHandler( async(req,res,next) => {
        const errors = validationResult(req)

        const genre = new Genre({
            _id: req.params.id,
            title: req.body.title
        })
        if(!errors.isEmpty()){
            res.render("genre_form",{
                title: "edit",
                genre: genre,
                errors: errors
            })
            return
        }
        const newGenre = await Genre.findByIdAndUpdate(req.params.id,genre,{})
        res.redirect(newGenre.url)
    })

]

exports.genre_detail = asyncHandler( async(req,res,next) => {
    const [albums,genre] = await Promise.all([
        Album.find({genre:req.params.id}).sort({title:1}).exec(),
        Genre.findById(req.params.id)
    ])
    res.render("genre_detail",{
        title: genre.title,
        genre: genre,
        albums: albums
    })
})