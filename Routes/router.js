const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const User = new UserController();
const Song = require('../Controllers/SongController');
const song = new Song();

router.post('/',User.createUser);
router.get('/',User.searchUser);
router.post('/song',song.uploadSong);
router.post('/playlist',User.addSongToPlaylist)


module.exports = router;