const PlayListModel = require('../models/PlayListModel');
const UserController = require('../Controllers/UserController');
const SongModel = require('../models/SongModel');

const express = require('express');
const bodyParser = require('body-parser');
// const multer =  require('multer');
const fileUpload = require('express-fileupload');

exports.createPlaylist = async (req, res) => {
    const userEmail = req.body.email;
    console.log(userEmail);
    const user = await UserController.findUserByEmail(userEmail);
    const userId = user._id;
    const playlistName = req.body.playlistName;
    console.log(userId);
    console.log(playlistName);
    let sampleFile ;
    let uploadPath ;
    if(!req.files ||Object.keys(req.files).length === 0|| req.files.mimetype!='image/*'){
        return res.status(400).send("No files were uploaded.");
    }
    else{
        sampleFile = req.files.sampleFile;
        uploadPath = __dirname+'/../images/'+sampleFile.name;
        sampleFile.mv(uploadPath, function(err) {
            if(err){
                return res.status(500).send(err);
            }
            else{
                console.log("File uploaded successfully");
            }
        });
    }
    try {
        const playlist = new PlayListModel({
            userId: userId,
            playlistName: playlistName,
            playlistImage: sampleFile.name  
        });
        const result = await playlist.save();
        res.status(200).send(result);

    } catch (error) {
        res.send({ message: error });
        
    }
}
    exports.updatePlayList = async (req,res)=>{
        try {
            const email = req.body.email;
            if(!email){
                return res.status(400).send("Please enter all the fields");
            }
            else{
                let userDetail = await UserModel.findOne({email:email});
                let objectId = userDetail._id;
                if(await PlayListModel.findOne({userId:objectId})){
                  let data= await PlayListModel.updateOne({userId:objectId},{$push:{songs:req.body.songs}});
                }
                    
            }
            

        } catch (error) {
            res.json({message:error});
        }
    
    
    }
    
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
    }




