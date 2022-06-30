const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const fileUpload = require('express-fileupload');
const multer = require('multer');
const UserModel = require("../models/userModel");
const SongModel = require("../models/SongModel");
const PlaylistModel = require("../models/PlaylistModel");


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
class Song{
    uploadSong = async (req,res)=>{
       try {
            const uploadFile = upload.single('song');
            uploadFile(req,res,async function(err){
                if(err instanceof multer.MulterError){
                    return res.status(500).send(err);
                }
                else if(err){
                    return res.status(500).send(err);
                }
                else{
                    if(req.file !=="" && req.file.mimetype.includes('audio')){
                       let data = await SongModel.findOne({title:req.file.originalname})
                        if(req.file.originalname == SongModel.findOne({title:req.file.originalname},{})){

                            return res.status(400).send("Song already exists");
                        }
                        else{
                            const title = req.file.originalname;
                            const size = (req.file.size/(1024*1024)).toPrecision(4);
                            const duration = req.file.duration;
                            const songPath = req.file.path;
                            const song = new SongModel({
                               title:title,size:size,duration:duration,songPath:songPath
                            });
                            song.save();
                            return res.status(200).send("Song uploaded successfully");
                        }
                    }
                    else{
                        return res.status(400).send("Please upload a song");
                    }
                    // return res.status(200).send("File uploaded successfully");
                }
            }
            );
        
       } catch (error) {
            res.send({message:error});
       }
            
    }

    uploadManySongs = async (req,res)=>{
        try {
            const uploadFile = upload.array('song');
            uploadFile(req,res,function(err){
                if(err instanceof multer.MulterError){
                    return res.status(500).send(err);
                }

                else if(err){
                    return res.status(500).send(err);
                }
                else{
                    console.log(req.files);
                    return res.status(200).send("File uploaded successfully");
                }
            }
            );
        } catch (error) {
            res.send({message:error});
        }
    }


    songs = async (req,res)=>{
        try {
            const songs = await SongModel.find({_id:0,__v:0});
            res.send(songs);
        } catch (error) {
            res.send({message:error});
        }
    }
    updateSong = async (req,res)=>{
        try {
            const song = await SongModel.findOne({_id:req.params.id});
            if(!song){
                return res.status(400).send("Song does not exist");
            }
            else{
                song.name = req.body.name;
                song.path = req.body.path;
                song.user = req.body.user;
                await song.save();
                res.send("Song updated successfully");
            }
        } catch (error) {
            res.send({message:error});
        }
    }
}

module.exports = Song;