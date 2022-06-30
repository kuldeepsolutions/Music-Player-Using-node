const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    PlayList:[{
        type :mongoose.Schema.Types.ObjectId,
        ref:"PlayList"
    }]
}));