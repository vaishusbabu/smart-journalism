const express=require('express')
const bodyParser=require('body-parser')
const db=require('./DBConnection')
const app=express()
const cors=require('cors')
const multer=require('multer')

// app.use(bodyParser.urlencoded({ extended: true })); //upload file
// app.use(bodyParser.json())

app.use(express.static(`${__dirname}/upload`));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(cors())
const route=require('./routes')
app.use('/smart_journalism_api',route)  //base api set

app.listen(4001,()=>{
    console.log("Server created successfully");
})