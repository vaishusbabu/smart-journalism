const mongoose= require("mongoose");

const nSchema=mongoose.Schema({
    title:{
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
    loc:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:Object
    },
    
    isactive:{
        type:Boolean,
        default:false
    },
    reviews:{
        type:Array
    },freelancer:{
        type:Boolean,
        default:true
    }

});
module.exports=mongoose.model('newses',nSchema)

