const express  = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();


// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION,()=>{
    console.log("Connected to the database");
})

// middleware
app.use(bodyParser.json({parameterLimit:1000000,limit:"100mb"}));
app.use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"100mb"}));
const router = require('./routes/router');
app.use('/',router);


app.listen(process.env.PORT||4000,()=>{
    console.log('Server started at port 4000');
});