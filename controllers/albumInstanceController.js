const Album = require("../models/album")
const AlbumInstance = require("../models/albumInstance")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")
const albumInstance = require("../models/albumInstance")

exports.albumInstance_list = asyncHandler( async(req,res,next) => {
    const albumInstances = await AlbumInstance.find({}).populate('album');
    res.render("albumInstance_list",{
        albumInstances: albumInstances
    })
})

exports.albumInstance_create_get = asyncHandler( async(req,res,next) => {
    const albums = await Album.find({}).sort({title:1}).exec()

    res.render("albumInstance_form",{
        title: "Create Copy",
        albums: albums
    })
})

exports.albumInstance_create_post = [
    body("album", "Album must be specified").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("arrival_date").optional({values: "falsy"})
    .isISO8601()
    .toDate(),

    asyncHandler( async(req,res,next) => {
        const errors = validationResult(req);

        const albumInstance = new AlbumInstance({
            album: req.body.album,
            status: req.body.status,
            arrival_date: req.body.arrival_date
        })
        if(!errors.isEmpty()){
            const albums = await Album.find({}).sort({title:1}).exec()

            res.render("albumInstance_form",{
                albumInstance: albumInstance,
                albums: albums,
                errors: errors
            })
            return
        }
        await albumInstance.save()
        res.redirect(albumInstance.url)
    })
]

exports.albumInstance_delete_get = asyncHandler( async(req,res,next) => {
    const albumInstance = await AlbumInstance.findById(req.params.id)

    res.render("albumInstance_delete",{
        albumInstance: albumInstance
    })
})

exports.albumInstance_delete_post = asyncHandler( async(req,res,next) => {
    await AlbumInstance.findByIdAndDelete(req.body.albumInstanceID)
    res.redirect("/albumInstances")
})

exports.albumInstance_update_get = asyncHandler( async(req,res,next) => {
    const [albumInstance,albums] = await Promise.all([
        AlbumInstance.findById(req.params.id),
        Album.find({}).sort({title:1}).exec()
    ])
    res.render("albumInstance_form",{
        title: "Edit Copy",
        albums:albums,
        albumInstance: albumInstance,
        selectedAlbum: albumInstance.album
    })
})

exports.albumInstance_update_post = [
    body("album", "Album must be specified").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("arrival_date").optional({values: "falsy"})
    .isISO8601()
    .toDate(),

    asyncHandler( async(req,res,next) => {
        const errors = validationResult(req)

        const albumInstance = new AlbumInstance({
            _id: req.params.id,
            album: req.body.album,
            status: req.body.status,
            arrival_date: req.body.arrival_date
        })
        if(!errors.isEmpty()){
            const albums = await Album.find({}).sort({title:1}).exec()

            res.render("albumInstance_form",{
                albumInstance: albumInstance,
                albums: albums,
                errors: errors
            })
            return
        }
        const updatedAlbumInstance = await AlbumInstance.findByIdAndUpdate(req.params.id,albumInstance,{})
        res.redirect(updatedAlbumInstance.url)
    })
]

exports.albumInstance_detail = asyncHandler( async(req,res,next) => {
    const albumInstance = await AlbumInstance.findById(req.params.id)
        .populate("album")
        .exec();
    console.log(albumInstance.status.toString())
    res.render("albumInstance_detail",{
        title: `Copy of ${albumInstance.album.title}`,
        albumInstance: albumInstance
    })
})