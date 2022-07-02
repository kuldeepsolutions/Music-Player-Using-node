const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const user = require('../Controllers/UserController');
const playlist = require('../Controllers/PlayListController');
const song = require('../Controllers/SongController');


// Objects


// middlewares

// for Users
router.post('/users',user.searchUser);
router.post('/createUser',user.createUser);
router.post('/users/login',user.loginUser);
router.post('/users/update',user.updateUser);
router.post('/users/delete',user.deleteUser);


// for Playlists
router.post('/createPlaylist',playlist.createPlaylist);
router.post('/updatePlaylist',playlist.updatePlayList);
router.post('/deletePlaylist',playlist.removePlaylist);


// for Songs

router.post('/createSong',song.uploadSong);
router.post('/updateSong',song.updateSong);
router.post('/deleteSong',song.deleteSong);
router.get('/songs',song.songs)



module.exports = router;