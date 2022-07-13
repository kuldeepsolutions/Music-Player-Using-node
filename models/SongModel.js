const mongoose  = require('mongoose');
module.exports = mongoose.model('Song',new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required:true
    },   
    size:{
        type:Number
    },
    duration:{
        type:Number
    },
    uploadedOn:{
        type:Date,
        default:Date.now

    },
    songPath:{
        type:String,
        required:true
    },
    usedTimes:{
        type:Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}));