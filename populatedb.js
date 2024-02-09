const imageToBase64 = require('image-to-base64')
require("dotenv").config()
const Album = require("./models/album")
const AlbumInstance = require("./models/albumInstance")
const Artist = require("./models/artist")
const Genre = require("./models/genre")

const albums = []
const albumInstances = []
const artists = []
const genres = []

const mongoose = require("mongoose");
const albumInstance = require("./models/albumInstance");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createArtists();
    await createAlbums();
    await createAlbumInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }

async function genreCreate(index,title){
    const genre = new Genre({
        title: title
    })
    await genre.save()
    genres[index] = genre
    console.log(`added genre: ${title}`)
}

async function artistCreate(index,title,description,artistImage,artistImageType){
    const artistDetails = {
        title:title,
        description: description,
        artistImageType: artistImageType,
    }
    artistDetails.artistImage = new Buffer.from(await imageToBase64(artistImage),"base64")

    const artist = new Artist(artistDetails)
    await artist.save()
    artists[index] = artist
    console.log(`added artist: ${title}`)
}

async function albumCreate(index,title,artist,description,release_date,genre,coverImage,coverImageType){
    const albumDetails = {
        title: title,
        artist: artist,
        description: description,
        release_date: release_date,
        coverImageType: coverImageType,
    }
    albumDetails.coverImage = new Buffer.from(await imageToBase64(coverImage),"base64")

    if (genre != false) albumDetails.genre = genre

    const album = new Album(albumDetails)
    await album.save()
    albums[index] = album
    console.log(`added album: ${title}`)

}

async function albumInstanceCreate(index,album,status,arrival_date){
    const albumInstanceDetails = {
        album: album,
        status: status,
        arrival_date: arrival_date,
    }
    if(arrival_date != false) albumInstanceDetails.arrival_date = arrival_date

    const albumInstance = new AlbumInstance(albumInstanceDetails)
    await albumInstance.save()
    albumInstances[index] = albumInstance
    console.log('added albumInstance')
}

async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Hip Hop"),
      genreCreate(1, "Electronica"),
      genreCreate(2, "Rock"),
    ]);
  }

  async function createArtists(){
    console.log("adding artists");
    await Promise.all([
        artistCreate(
            0,
            "Aphex Twin",
            "Richard D. James, best known as Aphex Twin, is far and away one of the most celebrated and influential electronic musicians of all time. Since the release of his earliest EPs in 1991,  has constantly pushed the limits of what can be accomplished with electronic equipment, resulting in forward-thinking and emotionally engaging work that ranges from sublime, pastoral ambience (Selected Ambient Works 85-92 and its 1994 follow-up) to manic head-rush acid techno (1992's Digeridoo EP).",
            "./populateImages/channels4_profile.jpg",
            "image/jpg"
            ),
        artistCreate(
            1,
            "Kendrick Lamar",
            "Kendrick Lamar's compelling lyricism, virtuosic microphone command, and sharp conceptual vision have translated to a rare combination of continuous chart feats and critical acclaim, plus respect and support from the artists who paved the way for the rapper's advancement.",
            "./populateImages/kendrick.jpg",
            "image/jpg"
        ),
        artistCreate(
            2,
            "Leb Zeppelin",
            "For more than fifty years, Led Zeppelin have continued to inspire generations with their groundbreaking blues-infused, guitar-driven rock n roll. The biggest rock band in the world throughout their 12-year reign, they remain one of the most influential and innovative groups in music history.",
            "./populateImages/led-zeppelin.jpg",
            "image/jpg"
        )
    ])
  }

async function createAlbums(){
    console.log("adding albums");
    await Promise.all([
        albumCreate(
            0,
            "Selected Ambient Works 85-92",
            artists[0],
            "description",
            "1992-11-9",
            genres[1],
            "./populateImages/Selected-Ambient-Works-85-92.png",
            "image/png"
        ),
        albumCreate(
            1,
            "Mr. Morale & the Big Steppers",
            artists[1],
            "description",
            "2022-5-13",
            genres[0],
            "./populateImages/kendrick.jpg",
            "image/jpg"
            ),
        albumCreate(
            2,
            "DAMN.",
            artists[1],
            "description",
            "2017-4-14",
            genres[0],
            "./populateImages/damn.jpg",
            "images/jpg"
        ),
        albumCreate(
            3,
            "Led Zeppelin",
            artists[2],
            "description",
            "1969,6,12",
            genres[2],
            "./populateImages/led_zeppelin_1.jpg",
            "images/jpg"
        ),
        4,
        "Led Zeppelin IV",
        artists[2],
        "description",
        "1971,11,08",
        "./populateImages/led-zeppelin-4.jpg",
        "images/jpg"
        
    ])
}

async function createAlbumInstances(){
    console.log("adding albumInstances");
    await Promise.all([
        albumInstanceCreate(
            0,
            albums[0],
            "ordered",
            "2024-6-22"
        ),
        albumInstanceCreate(
            1,
            albums[0],
            "ordered",
            "2024-6-20"
        ),
        albumInstanceCreate(
            2,
            albums[0],
            "available"
        ),
        albumInstanceCreate(
            3,
            albums[1],
            "available"
        ),
        albumInstanceCreate(
            4,
            albums[2],
            "ordered",
            "2024,8,13"
        ),
        albumInstanceCreate(
            5,
            albums[2],
            "ordered",
            "2024,8,10"
        ),
        albumInstanceCreate(
            6,
            albums[3],
            "ordered",
            "2024,7,12"
        ),
        albumInstanceCreate(
            6,
            albums[3],
            "ordered",
            "2024,7,12"
        ),
        albumInstanceCreate(
            6,
            albums[3],
            "available"
        )
    ])
}