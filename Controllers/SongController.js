const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer');
const mp3Duration = require('mp3-duration');
const SongModel = require("../models/SongModel");
const UserController = require("./UserController");
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
                    let data = await this.findSongByName(req.file.originalname.toString());
                    console.log(data);
                    if (!data) {
                        let User = await UserController.findUserByEmail(req.params.Email);
                        if (!User) {
                            return res.status(400).send("User does not exist");
                        }
                        let userId = User._id;
                        let duration = await mp3Duration(req.file.path,(err,length)=>{
                            return length;
                        })
                        let drn = (duration/60).toPrecision(2);
                        console.log(drn);
                        const size = req.file.size;
                        const newSize = Number(size / (1024*1024)).toFixed(2);
                                const song = new SongModel({
                                    title: req.file.originalname.toString(),
                                    songPath: req.file.path.toString(),
                                    size:newSize,
                                    usedTimes:0,
                                    user:userId,
                                    duration:drn

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

exports.findSong = async (req,res) => {
    try {
        songName = req.params.song;
        console.log("Find Song Method Called");
        const song = await SongModel.findOneAndUpdate({ title: songName},{$set:{usedTimes:0}});
        console.log(song);

        song.usedTimes = Number(song.usedTimes) + 1;
        song.save();
       if(!song){
         return res.status(400).send("Song does not exist");
       }else{
            // console.log(song.title,"\n",song.size);
            return res.send(song);
         }
        }
           
    
    catch (error) {
        return error;
    }
};

const shuffleSongs = async (songs) => {
    try {
     
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
        console.log("trying to get all songs");
        const songs = await SongModel.find({}, { _id: 0, __v: 0, songPath: 0 }).populate('user');
        let shuffledSongs = await shuffleSongs(songs);
        res.json(shuffledSongs);     
    } catch (error) {
        res.send("Error:-- "+error);
    }
};

exports.updateSong = async (req, res) => {
    try {
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
      
        const song = await SongModel.findOne({ song: req.params.song });
        if (!song) {
            return res.status(400).send("Song does not exist");
        }
        else {
            await song.remove();
            res.send("Song deleted successfully");
        }
    } catch (error) {
        res.send("Error:-- "+error);
    }
};
exports.findSongByName = async (songName) => {
    try {
        
        const song = await SongModel.findOneAndUpdate({ title: songName , usedTimes: { $lt: 0 } }, { $inc: { usedTimes: 1 } }, { new: true });
       
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
