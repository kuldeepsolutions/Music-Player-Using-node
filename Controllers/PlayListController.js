const PlayListModel = require('../models/PlayListModel');
const UserModel = require('../models/UserModel');
const SongModel = require('../models/SongModel');

const express = require('express');
const bodyParser = require('body-parser');

class Playlist{
    updatePlayList = async (req,res)=>{
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
}

module.exports = Playlist;