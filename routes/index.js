const express = require('express');
const router = express.Router();

const album_controller = require("../controllers/albumController")
const albumInstance_controller = require("../controllers/albumInstanceController")
const artist_controller = require("../controllers/artistController")
const genre_controller = require("../controllers/genreController")


//album routes

/* GET home page. */
router.get('/', album_controller.index);

router.get('/album/create', album_controller.album_create_get)

router.post('/album/create', album_controller.album_create_post)

router.get('/album/:id/delete', album_controller.album_delete_get)

router.post('/album/:id/delete', album_controller.album_delete_post)

router.get('/album/:id/update', album_controller.album_update_get)

router.post('/album/:id/update', album_controller.album_update_post)

router.get('/album/:id', album_controller.album_detail)

router.get('/albums',album_controller.album_list)

//albumInstance routes
router.get('/albumInstance/create', albumInstance_controller.albumInstance_create_get)

router.post('/albumInstance/create', albumInstance_controller.albumInstance_create_post)

router.get('/albumInstance/:id/delete', albumInstance_controller.albumInstance_delete_get)

router.post('/albumInstance/:id/delete', albumInstance_controller.albumInstance_delete_post)

router.get('/albumInstance/:id/update', albumInstance_controller.albumInstance_update_get)

router.post('/albumInstance/:id/update', albumInstance_controller.albumInstance_update_post)

router.get('/albumInstance/:id', albumInstance_controller.albumInstance_detail)

router.get('/albumInstances', albumInstance_controller.albumInstance_list)

//artist routes
router.get('/artist/create', artist_controller.artist_create_get)

router.post('/artist/create', artist_controller.artist_create_post)

router.get('/artist/:id/delete', artist_controller.artist_delete_get)

router.post('/artist/:id/delete', artist_controller.artist_delete_post)

router.get('/artist/:id/update', artist_controller.artist_update_get)

router.post('/artist/:id/update', artist_controller.artist_update_post)

router.get('/artist/:id', artist_controller.artist_detail)

router.get('/artists', artist_controller.artist_list)

//genre routes

router.get('/genre/create', genre_controller.genre_create_get)

router.post('/genre/create', genre_controller.genre_create_post)

router.get('/genre/:id/delete', genre_controller.genre_delete_get)

router.post('/genre/:id/delete', genre_controller.genre_delete_post)

router.get('/genre/:id/update', genre_controller.genre_update_get)

router.post('/genre/:id/update', genre_controller.genre_update_post)

router.get('/genre/:id', genre_controller.genre_detail)

router.get('/genres', genre_controller.genre_list)

module.exports = router;
