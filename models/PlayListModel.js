const mongoose = require("mongoose");
module.exports = mongoose.model("PlayList", new mongoose.Schema({
    playlistName:{
        type:String,
        required:true
    },
    songImage:{
        type:String
    },
    song:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Song'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
}));