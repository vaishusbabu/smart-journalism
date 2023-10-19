const mongoose= require("mongoose");

const mSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
       
        dropDups: true
    },
    maxCount:{
        type:Number,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
  
    days:{
        type:Number,
        required:true
    }
});
module.exports=mongoose.model('plans',mSchema)

