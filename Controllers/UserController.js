const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("../models/userModel");
const SongModel = require("../models/SongModel");
const PlaylistModel = require("../models/PlaylistModel");

// const SongController = require("./SongController");
// const PlayListController  = require("./PlayListController");
class User{
    // create new User

  createUser = async (req,res)=>{
        try {
            const userName = req.body.name;
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            if(!userName || !userEmail || !userPassword){
                return res.status(400).send("Please enter all the fields");
            }
            else{
                if(await UserModel.findOne({email:userEmail})){
                    return res.status(400).send("User already exists");
                }
                else
                {
                    const user = new UserModel({
                        name:userName,
                        email:userEmail,
                        password:userPassword
                    });
                    await user.save();
                    return res.status(200).send("User created successfully");
                }
            }
        } catch (error) {
            res.send({message:error});
        }
    }
    // Login User
    loginUser = async (req,res)=>{
        try {
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            if(!userEmail || !userPassword){
                return res.status(400).send("Please enter all the fields");
            }
            else{
                const user = await UserModel.findOne({email:userEmail}).populate("PlayList");
                if(!user){
                    return res.status(400).send("User does not exist");
                }
                else{
                    if(user.password === userPassword){
                        return res.status(200).send("Login successful");
                    }
                    else{
                        return res.status(400).send("Password is incorrect");
                    }
                }
            }
        } catch (error) {
            res.send({message:error});
        }
    }

    searchUser = async (req,res)=>{
        try {
            const type = req.body.type;
            switch(type){
                case "name":
                    const name = req.body.name;
                    if(await UserModel.findOne({name:req.body.name})){
                        
                         const data = await UserModel.findAll({name:req.body.name},{_id:0,__v:0,password:0});
                        res.json(data);
                        // res.status(200).send("User exists");
                    }
                    else{
                        return res.status(400).send("User does not exist");
                    }
                    break;
                    case "email":
                const userEmail = req.body.email;
                if(!userEmail){
                    return res.status(400).send("Please enter your email");
                }
                else{
                    const user = await UserModel.findOne({email:userEmail},{_id:0,__v:0,password:0});
                    if(!user){
                        return res.status(400).send("User does not exist");
                    }
                    else{
                        return res.status(200).send(user);
                    }
                }
                break;
                default:
                    return res.status(400).send("Please enter a valid type");
        }

        } catch (error) {
            res.send({message:error});
        }
    }
    updateUser = async (req,res)=>{
        try {
            const type = req.body.type;
            switch(type){
                case "name":
                    const name = req.body.name;
                    if(!name){
                        return res.status(400).send("Please enter your name");
                    }
                    else{
                        const user = await UserModel.findOneAndUpdate({email:req.body.email},{name:name});
                        if(!user){
                            return res.status(400).send("User does not exist");
                        }
                        else{
                            return res.status(200).send("User updated successfully");
                        }
                    }
                    break;
                    case "email":
                const userEmail = req.body.email;
                if(!userEmail){
                    return res.status(400).send("Please enter your email");
                }
                else{
                    const user = await UserModel.findOneAndUpdate({email:userEmail},{email:userEmail});
                    if(!user){
                        return res.status(400).send("User does not exist");
                    }
                    else{
                        return res.status(200).send("User updated successfully");
                    }
                }
                break;
                case "password":
                    const userPassword = req.body.password;
                    if(!userPassword){
                        return res.status(400).send("Please enter your password");
                    }
                    else{
                        const user = await UserModel.findOneAndUpdate({email:req.body.email},{password:userPassword});
                        if(!user){
                            return res.status(400).send("User does not exist");
                        }
                        else{
                            return res.status(200).send("User updated successfully");
                        }
                    }
                    break;
          
                default:
                    return res.status(400).send("Please enter a valid type");
            }

        } catch (error) {
            res.send({message:error});
        }
    }
    deleteUser = async (req,res)=>{
        try {
            const userEmail = req.body.email;
            if(!userEmail){
                return res.status(400).send("Please enter your email");
            }
            else{
                const user = await UserModel.findOneAndDelete({email:userEmail});
                if(!user){
                    return res.status(400).send("User does not exist");
                }
                else{
                    return res.status(200).send("User deleted successfully");
                }
            }
        } catch (error) {
            res.send({message:error});
        }
    }
    removePlaylist = async (req,res)=>{
        try {
            const playlistId = req.body.playlistId;
            if(!playlistId){
                return res.status(400).send("Please enter your playlistId");
            }
            else{
                const playlist = await PlaylistModel.findOneAndDelete({_id:playlistId});
                if(!playlist){
                    return res.status(400).send("Playlist does not exist");
                }
                else{
                    return res.status(200).send("Playlist deleted successfully");
                }
            }
        } catch (error) {
            res.send({message:error});
        }
    }
    addSongToPlaylist = async (req,res)=>{
        try {
            const songName = req.body.title;
            if(!songName){
                return res.status(400).send("Please enter the song name");
            }
            else{
                if(await SongModel.findOne({title:songName})){
                    const song = await SongModel.findOne({title:songName});
                    const playlist = await PlaylistModel.create({_id:req.body.playlistId},{$push:{songs:song._id}});
                    if(!playlist){
                        return res.status(400).send("Sorry! You don't have any playlist");
                    }
                    else{
                        return res.status(200).send("Song added to playlist successfully");
                    }
                }
            }
        } catch (error) {
            res.send({message:error});
        }
    }
    updatePlayList = async (req,res)=>{
        try {
            const email = req.body.email;
            if(!email){
                return res.status(400).send("Please enter all the fields");
            }
            else{
                let userDetail = await UserModel.findOne({email:email});
                let objectId = userDetail._id;
                if(await PlaylistModel.findOne({userId:objectId})){
                  let data= await PlaylistModel.updateOne({userId:objectId},{$push:{songs:req.body.songs}});
                }
                    
            }
            

        } catch (error) {
            res.json({message:error});
        }
    
    
    }
}

module.exports = User;