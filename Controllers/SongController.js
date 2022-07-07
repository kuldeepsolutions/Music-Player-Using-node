const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer');
const SongModel = require("../models/SongModel");

var count = 0;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './songs/')
    }
    , filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
}
);
exports.uploadSong = async (req, res) => 
{
    var upload = multer({ storage: storage });      
    try {
        const uploadFile = upload.single('song');
        uploadFile(req, res, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            else {
                if (req.file == "" || req.file == undefined) {
                    return res.status(400).send("Please upload a Song");
                }
                else {
                    let data = await findSong(req.file.originalname.toString());
                    if (!data) {
                       const size = req.file.size;
                       const newSize = Number(size / (1024*1024)).toFixed(2);
                            const song = new SongModel({
                                title: req.file.originalname.toString(),
                                songPath: req.file.path.toString(),
                                size:newSize
                            });
                            await song.save();
                            return res.status(200).send("Song uploaded successfully");               
                    }
                    else {
                        console.log("Song already exists");
                        return res.status(400).send("Song already exists");
                    }
                }
            }
        }
        );
    }
    catch (error) {
        res.send({ message: error });
    }
};
const findSong = async (songName) => {
    try {
        count++;
        const song = await SongModel.findOne({ title: songName });
       if(!song){
         console.log("Database Updated"); 
       }else{
            console.log(song.title,"\n",song.size);
            return song;
         }
    }
    catch (error) {
        return error;
    }
};

const shuffleSongs = async (songs) => {
    try {
        count++;
        let shuffledSongs = [];
        let random = Math.floor(Math.random() * songs.length);
        shuffledSongs.push(songs[random]);
        songs.splice(random, 1);
        while (songs.length > 0) {
            random = Math.floor(Math.random() * songs.length);
            shuffledSongs.push(songs[random]);
            songs.splice(random, 1);
        }
        return shuffledSongs;
    } catch (error) {
        console.log("Error in shuffling songs");
    }
};
exports.songs = async (req, res) => {
    try {
        count++;
        console.log("trying to get all songs");
        const songs = await SongModel.find({}, { _id: 0, __v: 0, songPath: 0 });
        let shuffledSongs = await shuffleSongs(songs);
        // console.log(await shuffleSongs(songs));
        res.json(shuffledSongs);
    } catch (error) {
        res.send("Error in finding songs"+error);
    }
};
exports.updateSong = async (req, res) => {
    try {
        count++;
        const song = await SongModel.findOne({ song: req.params.song });
        if (!song) {
            return res.status(400).send("Song does not exist");
        }
        else {
            song.title = req.body.name;
            song.path = req.body.path;
            song.user = req.body.user;
            await song.save();
            res.send("Song updated successfully");
        }
    } catch (error) {
        res.send({ message: error });
    }
};

exports.deleteSong = async (req, res) => {
    try {
        count++;
        const song = await SongModel.findOne({ song: req.params.song });
        if (!song) {
            return res.status(400).send("Song does not exist");
        }
        else {
            await song.remove();
            res.send("Song deleted successfully");
        }
    } catch (error) {
        res.send({ message: error });
    }
};
exports.findSongByName = async (songName) => {
    try {
        count++;
        const song = await SongModel.findOne({ title: songName });
        if (!song) {
            console.log("Song does not exist");
        }
        else {
            return song;
        }
    } catch (error) {
        console.log("Error in finding song by name");
    }
};
