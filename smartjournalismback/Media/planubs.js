const mongoose= require("mongoose");

const mSchema=mongoose.Schema({
    planid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'plans',
        required:true
    },
    usrType:{
        type:String,
        required:true
    },
    mid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'medias'
    },
    jid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'journalists'
    },
  
    date:{
        type:Date,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    }
});
module.exports=mongoose.model('plansubscriptions',mSchema)

