const vnews=require('./videoNews')
const multer=require('multer')
// const cart = require('../user/cart_model')



    const storage=multer.diskStorage({
       destination:function(req,res,cb){
           cb(null,'./upload')
       },
       filename:function(req,file,cb){
           cb(null,file.originalname)
       }
    })

    const upload=multer({storage:storage}).single('video')



// video newses

//add news 

const addVideoNews=(req,res)=>{
    let video=req.file
    let date=new Date()
    const newNews=new vnews({
        title:req.body.title, 
        date:date,
        jid:req.body.jid,
        video:video,
        category:req.body.category,
        content:req.body.content,
        loc:req.body.loc,
        freelancer:req.body.freelancer,
        mid:req.body.mid
     
    })
    newNews.save().then(data=>{
        res.json({
            status:200,
            msg:"Inserted successfully",
            data:data
        })
    }).catch(err=>{
        res.json({
            status:500,
            msg:"Data not Inserted",
            Error:err
        })
    })
}



//View all news

const viewVideoNewses=(req,res)=>{
  vnews.find({isactive:true}).exec()
  .then(data=>{
    if(data.length>0){
    res.json({
        status:200,
        msg:"Data obtained successfully",
        data:data
    })
  }else{
    res.json({
      status:200,
      msg:"No Data obtained "
  })
  }
}).catch(err=>{
    res.json({
        status:500,
        msg:"Data not Inserted",
        Error:err
    })
})

}

//View all v news reqs

const viewVideoNewsReqsforMedia=(req,res)=>{
    vnews.find({isactive:false,mid:req.params.mid}).exec()
    .then(data=>{
      if(data.length>0){
      res.json({
          status:200,
          msg:"Data obtained successfully",
          data:data
      })
    }else{
      res.json({
        status:200,
        msg:"No Data obtained "
    })
    }
  }).catch(err=>{
      res.json({
          status:500,
          msg:"Data not Inserted",
          Error:err
      })
  })
  
  }
  

//Approve videonews by media
const updateVNewsByMedia=(req,res)=>{
   
    vnews.findByIdAndUpdate({_id:req.params.nid},{
      
      
      isactive:true
      
      })
  .exec().then(data=>{
    res.json({
        status:200,
        msg:"Updated successfully"
    })
  }).catch(err=>{
    res.json({
        status:500,
        msg:"Data not Updated",
        Error:err
    })
  })
  }
  
//view videos by m id
  const viewvNewsByMedia=(req,res)=>{
  
    vnews.find({mid:req.params.mid,isactive:true}).sort({date:-1}).exec()
    .then(data=>{
   if(data.length>0){
      console.log(data);
      res.json({
          status:200,
          msg:"Data obtained successfully",
          data:data
      })
   }
   else{
    
    res.json({
        status:500,
        msg:"No Data obtained"
    })
   }
  }).catch(err=>{
    console.log(err);
      res.json({
          status:500,
          msg:"No Data obtained",
          Error:err
      })
  })
  
  }
//view videos from freelancer to admin
const viewFreelancervNewsReqsByAdmin=(req,res)=>{
  
    vnews.find({isactive:false,freelancer:true}).sort({date:-1}).exec()
    .then(data=>{
   if(data.length>0){
      console.log(data);
      res.json({
          status:200,
          msg:"Data obtained successfully",
          data:data
      })
   }
   else{
    
    res.json({
        status:500,
        msg:"No Data obtained"
    })
   }
  }).catch(err=>{
    console.log(err);
      res.json({
          status:500,
          msg:"No Data obtained",
          Error:err
      })
  })
  
  }

//aprove videos from freelancer by admin

const approveVNewsReqsByAdmin=(req,res)=>{
  
    vnews.findByIdAndUpdate({_id:req.params.id},{isactive:true}).exec()
    .then(data=>{
   if(data.length>0){
      console.log(data);
      res.json({
          status:200,
          msg:"Data obtained successfully",
          data:data
      })
   }
   else{
    
    res.json({
        status:500,
        msg:"No Data obtained"
    })
   }
  }).catch(err=>{
    console.log(err);
      res.json({
          status:500,
          msg:"No Data obtained",
          Error:err
      })
  })
  
  }


//view video news  by id 

const viewVNewsById=(req,res)=>{
  
    vnews.findOne({_id:req.params.id}).exec()
    .then(data=>{
   
      console.log(data);
      res.json({
          status:200,
          msg:"Data obtained successfully",
          data:data
      })
    
  }).catch(err=>{
    console.log(err);
      res.json({
          status:500,
          msg:"No Data obtained",
          Error:err
      })
  })
  
  }
  //delelte video news
  
  const delVNewsById=(req,res)=>{
    
      vnews.findOneAndDelete({_id:req.params.id}).exec()
      .then(data=>{
     
        console.log(data);
        res.json({
            status:200,
            msg:"Data removed successfully"
            
        })
      
    }).catch(err=>{
      console.log(err);
        res.json({
            status:500,
            msg:"No Data obtained",
            Error:err
        })
    })
    
    }


// add reviews by public
const addComment = (req, res) => {
    let review = req.body.comments;
    let arr = [];
    vnews
      .findById({ _id: req.params.id })
      .exec()
      .then((data) => {
        arr = data.reviews;
        arr.push(review);
        console.log(arr);
        vnews
          .findByIdAndUpdate(
            { _id: req.params.id },
            {
              reviews: arr,
            }
          )
          .exec()
          .then((data) => {
            res.json({
              status: 200,
              msg: "Data obtained successfully",
              data: data,
            });
          })
          .catch((err) => {
            res.json({
              status: 500,
              msg: "Data not Inserted",
              Error: err,
            });
          });
      });
  };

    module.exports={addVideoNews,viewVideoNewsReqsforMedia,upload,viewVNewsById,
        viewVideoNewses,viewvNewsByMedia,updateVNewsByMedia,delVNewsById,
    approveVNewsReqsByAdmin,viewFreelancervNewsReqsByAdmin,addComment}