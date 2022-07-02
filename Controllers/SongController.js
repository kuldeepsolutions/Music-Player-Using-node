const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer');
const SongModel = require("../models/SongModel");



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './songs/')
    }
    , filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
}
);

var upload = multer({ storage: storage });

    exports.uploadSong = async (req, res) => {
        const errhandler = async function (err,) {
            if (err instanceof multer.MulterError) {
                return res.status(500).send(err);
            }
            else if (err) {
                return res.status(500).send(err);
            }
            else {
                if (req.file !== "" && req.file.mimetype.includes('audio')) {
                    let data = await SongModel.findOne({ title: req.file.originalname }, { _id: 0, __v: 0, songPath: 0, size: 0 })
                    if (req.file.originalname == data) {

                        return res.status(400).send("Song already exists");
                    }
                    else {
                        const title = req.file.originalname;
                        const size = (req.file.size / (1024 * 1024)).toPrecision(4);
                        const duration = req.file.duration;
                        const songPath = req.file.path;
                        const song = new SongModel({
                            title: title, size: size, duration: duration, songPath: songPath
                        });
                        song.save();
                        return res.status(200).send("Song uploaded successfully");
                    }
                }
                else {
                    return res.status(400).send("Please upload a song");
                }
            }
        }
        try {
            const uploadFile = upload.single('song');
            uploadFile(req, res, errhandler);
        } catch (error) {
            res.send({ message: error });
        }
    }
    exports.songs = async (req, res) => {
        try {
            const songs = await SongModel.find({}, { _id: 0, __v: 0, songPath: 0 });
            res.json(songs);
        } catch (error) {
            res.send({ message: error });
        }
    }
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
    }
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
            res.send({ message: error });
        }
    }