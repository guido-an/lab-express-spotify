/** packages required **/
const express = require("express"); // express
const hbs = require("hbs"); // hbs
const SpotifyWebApi = require("spotify-web-api-node"); // spotify-web-api-node

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// const clientId = '14e3b24bdcc54f8aa2f94acb66b52445',   /** Merle API */
//    clientSecret = 'd6cdb344db414d3e80611e1b32e47a9a';

const clientId = "7384a50b07eb4793ad1a95686be92a77",  /** My API */
  clientSecret = "2b7af0cdb16645c6ba65c56d018785a5";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    //console.log(data)
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

/** Home **/
app.get("/", (req, res, next) => {
  res.render("index");
});

/** Artists **/
app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.name) // the searched name in the input as a parameter
    .then(data => {
      res.render("artists", data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

/*** Album Page ***/
app.get("/albums/:artistId", (req, res, next) => {  
  spotifyApi.getArtistAlbums(req.params.artistId, { limit : 10, offset : 1 })  // look for albums based on artistId

    .then(album => {
      console.log(album.body)
      res.render("albums", album.body);
    })

    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

/*** Tracks ***/
app.get("/tracks/:albumId", (req, res, next) => {  
  spotifyApi.getAlbumTracks(req.params.albumId) // look for tracks based on albumId
    .then(track => {
      debugger
      console.log(track.body);
      res.render("tracks", track.body);
    })

    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
