const mongoose= require("mongoose");

const nSchema=mongoose.Schema({
    msg:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true

    },
    jid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'journalists',
        required:true
    },
  
    mid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'medias'
        
    },
    latitude:{
        type:String
    },
    longitude:{
        type:String
    },
    freelancer:{
        type:Boolean,
        required:true
    },
    isactive:{
        type:Boolean,
        default:true
    }

});
module.exports=mongoose.model('criticalissues',nSchema)

