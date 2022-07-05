const PlayListModel = require('../models/PlayListModel');
const UserController = require('../Controllers/UserController');
const SongModel = require('../models/SongModel');
// const SongController = require('../Controllers/SongController');

const express = require('express');
const bodyParser = require('body-parser');
const multer =  require('multer');
// const fileUpload = require('express-fileupload');
// express.Router().use(fileUpload())
express.Router().use(bodyParser.json());
express.Router().use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"1gb"}));

exports.createPlaylist = async (req, res) => {
    const userEmail = req.params.email;
    console.log(userEmail);
    const user = await UserController.findUserByEmail(userEmail);
    const userId = user._id;
    const playlistName = req.params.playlistName;
    console.log(userId);
    console.log(playlistName);

    var storage = multer.diskStorage({destination:function(req,file,cb){
        cb(null,'./images/')
    },filename:function(req,file,cb){
        cb(null,file.originalname)
    }});
    console.log(user);
    var upload = multer({storage:storage})
    try {
        const uploadFile = upload.single('image');
        uploadFile(req, res, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            else {
                if (req.file == "" || req.file == undefined) {
                    return res.status(400).send("Please upload an image");
                }
                else {
                   
                    const playlist = new PlayListModel({
                        playlistName: playlistName,
                        userId: userId,
                        image: req.file.originalname
                    });
                   await playlist.save();
                    return res.status(200).send("Playlist created successfully");
                }
            }
        }
        );
    }
    catch (error) {
        res.send({ message: error });
    }    

};
exports.updatePlayList = async (req,res)=>{
    try {
        const email = req.body.email;
        const songTitle = req.body.songTitle;
        if(!email&&!songTitle){
            return res.status(400).send("Please enter all the fields");
        }
        else{
            // get User Details for confirmation
            let userDetail =  await UserController.findUserByEmail(email);
            let objectId = userDetail._id;
            // get song data for song  confirmation
            let song = await SongController.findSongByName(songTitle);
            let songId = song._id;

            // get playlist data for updating playlist
            let playlist = await PlayListModel.find({userId:objectId});
            for(let i=0;i<playlist.length;i++){
                let playlistId = playlist[i]._id;
                if(!playlist){
                    return res.status(400).send("Please create a playlist first");

                }
                else{
                    let update = await PlayListModel.findOneAndUpdate({_id:playlistId},{$push:{song:songId}});
                    if(!update){
                        return res.status(400).send("Failed to add song to playlist");
                    }
                    else{
                        return res.status(200).send("Song added successfully");
                    }
                } 
        }                      
        }
    } catch (error) {
        res.send("Unable to Update PlayList : "+error);
    }
};

exports.removePlaylist = async (req,res)=>{
    try {
        const playlistId = req.body.playlistId;
        if(!playlistId){
            return res.status(400).send("Please enter your playlistId"+`Total Visits: ${count}`);
        }
        else{
            const playlist = await PlayListModel.findOneAndDelete({_id:playlistId});
            if(!playlist){
                return res.status(400).send("Playlist does not exist"+`Total Visits: ${count}`);
            }
            else{
                return res.status(200).send("Playlist deleted successfully"+`Total Visits: ${count}`);
            }
        }
    } catch (error) {
        res.send({message:error});
    }
};

exports.displayPlaylist = async (req,res)=>{
    try {
        let userEmail = req.params.email;
        
        let user = await UserController.findUserByEmail(userEmail);
        let userId = user._id;
        
        let playlist = await PlayListModel.find({userId:userId}).populate('song');
        if(!playlist){
            return res.status(400).send("No playlist found");
        }
        else{
            return res.status(200).send(playlist);
        }

    } catch (error) {
        res.send("Unable to display PlayList : "+error);
    }
    
};