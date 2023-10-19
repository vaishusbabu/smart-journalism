const mongoose= require("mongoose");

const Schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    
  
    email:{
        type:String,
        unique:true,
        required:true,
       
        dropDups: true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('publics',Schema)

