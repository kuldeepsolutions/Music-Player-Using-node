const PlayListModel = require('../models/PlayListModel');
const UserController = require('../Controllers/UserController');
const SongModel = require('../models/SongModel');
const SongController = require('../Controllers/SongController');

const multer =  require('multer');

var count = 0;
const checkPlayList = async (playlistName)=>{
    try {
        let playlist = await PlayListModel.find({playlistName:playlistName});
        if(!playlist){
            console.log("playlist does not exist");
            return false;
        }
        else{
            return playlist;
        }
    } catch (error) {
        return error;
    }
}
exports.createPlaylist = async (req, res) => {
    const userEmail = req.params.email;
    const playlistName = req.params.playlistName;
    console.log(userEmail);
    const user = await UserController.findUserByEmail(userEmail.toString());
    const userId = user._id;
    // const checkPlaylist = await checkPlayList(playlistName.toString());
    // if(checkPlaylist == null || checkPlaylist == undefined || checkPlaylist == "" ){
    //     console.log("playlist already exists");
    //     return res.status(400).send("Playlist already exists");
    // }
    // else{
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
            console.log(req.file);
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
}   
// };
exports.updatePlayList = async (req,res)=>{
    try {
        const email = req.body.email;
        const songTitle = req.body.song;
        const playlistName = req.body.playlistName;
        // console.log(playlistName);
        if(!email&&!songTitle&&!playlistName){
            return res.status(400).send("Please enter all the fields");
        }
        else{
            // get User Details for confirmation
            let userDetail =  await UserController.findUserByEmail(email);
            let objectId = userDetail._id;          
            // get song data for song  confirmation
            let song = await SongController.findSongByName(songTitle);         
            let songId = song._id;
            let playlist1 = await checkPlayList(playlistName.toString()) ;        
            if(playlist1 == null || playlist1 == undefined || playlist1 == ""){
                console.log("Playlist does not exist");
                return res.status(400).send("Playlist does not exist");
            }
            else{
                for(let i=0;i<playlist1.length;i++){
                    let playlistId = playlist1[i]._id;
                    // console.log(playlistId);
                    
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
        } 
    catch (error) {
        res.send("Unable to Update PlayList : "+error);
    }
};
exports.removePlaylist = async (req,res)=>{
    try {
        const Playlist = req.body.playlistId||req.body.playlist;
        console.log(Playlist);
        if(!Playlist){
            return res.status(400).send("Please enter your playlistId"+`Total Visits: ${count}`);
        }
        else{
            const playlist = await PlayListModel.findOneAndDelete({playlistName:Playlist});
            if(!playlist){
                return res.status(400).send("Playlist does not exist\n"+`Total Visits: ${count}`);
            }
            else{
                console.log(await checkPlayList(Playlist));
                return res.status(200).send("Playlist deleted successfully\n"+`Total Visits: ${count}`);
            }
        }
    } catch (error) {
        res.send("Unable to delete PlayList : "+error);
    }
};
const shuffleData = async (data)=>
    {
        try {
        let user = await UserController.findUserByEmail(data);
        let userId = user._id;
        // console.log(userId);
        let playlist = await PlayListModel.find({userId:userId},{_id:0,__v:0,createdAt:0,userId:0}).populate('song');
        // console.log(playlist.length);
        let playlistLength = playlist.length;
        let playlistDataArray = Array.from(playlist,(playlist)=>{
            return playlist.song;
        });
        // console.log(playlistDataArray);
        let i,j,i1,j1;
        for(i=0;i<playlistDataArray.length;i++){
            for(j=0;j<playlistDataArray[i].length;j++){
                    let i1 = Math.floor(Math.random()*playlistDataArray.length);
                    j1 = Math.floor(Math.random()*playlistDataArray[i1].length);
                    let temp = playlistDataArray[i][j];
                    playlistDataArray[i][j] = playlistDataArray[i1][j1];
                    playlistDataArray[i1][j1] = temp;
                }   
            }
            // console.log("\nSHUFFLED DATA\n");
            // console.log(playlistDataArray);
            return playlistDataArray;
        } catch (error) {
            console.log(error);
        }
    };
exports.displayPlaylist = async (req,res)=>{
    try {
        let userEmail = req.params.email;  
        let user = await UserController.findUserByEmail(userEmail);
        let userId = user._id;
        let playlist = await PlayListModel.find({userId:userId},{__v:0,_id:0}).populate('song');
        if(!playlist){
            return res.status(400).send("No playlist found");
        }
        else{
            // console.log("\n====================\nDisplaying the Playlist data:\n======================== \n");
            let shuffledData = await shuffleData(userEmail.toString());
            let shuffleDataObject ={};
            shuffledData.forEach((v)=>{
                let key = v[0];
                let value = v[1];
                shuffleDataObject[key] = value;
                // console.log(shuffleData);
            })
            // console.log(await shuffleData(userEmail.toString()));
            console.log("\n =================================== \n");
            return res.status(200).send(playlist+shuffleDataObject);
        }
    } catch (error) {
        res.send("Unable to display PlayList : "+error);
    }
};