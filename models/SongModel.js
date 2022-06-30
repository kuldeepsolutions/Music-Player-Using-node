const mongoose  = require('mongoose');
module.exports = mongoose.model('Song',new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    
    size:{
        type:Number
    },
    duration:{
        type:Number
    },
    songPath:{
        type:String,
        required:true
    }
}));