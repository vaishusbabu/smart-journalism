const mongoose= require("mongoose");

const Schema=mongoose.Schema({
    pid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'publics',
        required:true
    },
    nid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'newses',
        required:true,
    },
    date:{
        type:Date,
        required:true
    }
});
module.exports=mongoose.model('savednewses',Schema)

