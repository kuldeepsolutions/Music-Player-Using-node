const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("../models/userModel");
const PlayListController = require("./PlayListController");
var count =0;
exports.createUser = async (req,res)=>{
    try {
        const userName = req.body.name;
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        if(!userName || !userEmail || !userPassword){
            return res.status(400).send(`
            Please enter all the fields<br>
            Total Visits: ${count}
            `);
        }
        else{
            if(await UserModel.findOne({email:userEmail})){
                return res.status(400).send("User already exists"+`Total Visits: ${count}`);
            }
            else
            {
                const user = new UserModel({
                    name:userName,
                    email:userEmail,
                    password:userPassword
                });
                await user.save();
                return res.status(200).send("User created successfully"+`Total Visits: ${count}`);
            }
        }
    } catch (error) {
        res.send("Error: "+error);
    }
}
// Login User
exports.loginUser = async (req,res)=>{
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        if(!userEmail || !userPassword){
            return res.status(400).send("Please enter all the fields"+`Total Visits: ${count}`);
        }
        else{
            const user = await UserModel.findOne({email:userEmail}).populate("PlayList");
            if(!user){
                return res.status(400).send("User does not exist"+`Total Visits: ${count}`);
            }
            else{
                if(user.password === userPassword){
                    return res.status(200).send("Login successful"+`Total Visits: ${count}`);
                }
                else{
                    return res.status(400).send("Password is incorrect"+`Total Visits: ${count}`);
                }
            }
        }
    } catch (error) {
        res.send({message:error});
    }
};
exports.searchUser = async (req,res)=>{
    try {
        const type = req.body.type;
        switch(type){
            case "name":
                const name = req.body.name;
                if(await UserModel.findOne({name:req.body.name})){                    
                    const data = await UserModel.findAll({name:req.body.name},{_id:0,__v:0,password:0});
                    res.json(data);
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
exports.updateUser = async (req,res)=>{
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
                const oldUserEmail = req.body.email;
                const newUserEmail = req.body.newEmail;
                if(!userEmail){
                    return res.status(400).send("Please enter your email");
                }
                else{
                    const user = await UserModel.findOneAndUpdate({email:oldUserEmail},{email:newUserEmail});
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
                        return res.status(200).send("User updated successfully"+`Total Visits: ${count}`);
                    }
                }
            break;
            case "playlist":
                const playlist = req.body.playlist;
                if(!playlist){
                    return res.status(400).send("Please enter your playlist");
                }
                else{
                    let Playlist = await PlayListController.getPlaylist(playlist.toString());
                    if(!Playlist){
                        return res.status(400).send("Playlist does not exist");
                    }
                    else{                     
                        let playlistId = Playlist[0]._id;
                        const user = await UserModel.findOneAndUpdate({email:req.body.email},{PlayList:playlistId});
                        if(!user){
                            return res.status(400).send("User does not exist");
                        }
                        else{
                            return res.status(200).send("User updated successfully");
                        }
                }
            }
                break;
            default:
                return res.status(400).send("Please enter a valid type"+`Total Visits: ${count}`);
        }
    } catch (error) {
        res.send("Error: "+error);
    }
};
exports.deleteUser = async (req,res)=>{ 
    try {
        const userEmail = req.body.email;
        if(!userEmail){
            return res.status(400).send("Please enter your email"+`Total Visits: ${count}`);
        }
        else{
            const user = await UserModel.findOneAndDelete({email:userEmail});
            if(!user){
                return res.status(400).send("User does not exist"+`Total Visits: ${count}`);
            }
            else{
                return res.status(200).send("User deleted successfully"+`Total Visits: ${count}`);
            }
        }
    } catch (error) {
        res.send("Error: "+error);
    }
};  
exports.getAllUsers = async (req,res)=>{
    try {
        const users = await UserModel.find({},{_id:0,__v:0,password:0});
        console.log(users);
        if(!users){
            return res.status(400).send("No users found"+`Total Visits: ${count}`);
        }
        else{
            return res.status(200).send(users);
        }
    } catch (error) {
        res.send({message:error});
    }
};
exports.findUserByEmail = async (userEmail)=>{
    try {
        userEmail = userEmail.toString();
        if(!userEmail){
            console.log("Please enter your email");
        }
        else{
            const user = await UserModel.findOne({email:userEmail},{_id:1,__v:0,password:0});
            if(!user){
                // console.log("User does not exist");
                return;
            }
            else{
                return user;
            }
        }
    } catch (error) {
        console.log("Error: "+error);
    }
};