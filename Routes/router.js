const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true,parameterLimit:10000000,limit:"1gb"}));

// Dependencies

const user = require('../Controllers/UserController');
const playlist = require('../Controllers/PlayListController');
const song = require('../Controllers/SongController');


// for Users
router.post('/users',user.searchUser);
router.post('/createUser',user.createUser);
router.post('/users/login',user.loginUser);
router.post('/users/update',user.updateUser);
router.post('/users/delete',user.deleteUser);


// for Songs
router.get('/allSong',song.songs);
router.post('/createSong',song.uploadSong);
router.post('/updateSong',song.updateSong);
router.post('/deleteSong',song.deleteSong);


// for Playlists
router.get('/:email',playlist.displayPlaylist);
router.post('/createPlaylist/:email&:playlistName',playlist.createPlaylist);
router.post('/updatePlaylist',playlist.updatePlayList);
router.post('/deletePlaylist',playlist.removePlaylist);

// export the router to use in index.js
module.exports = router;