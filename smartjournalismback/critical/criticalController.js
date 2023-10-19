const critical=require('./critical')
//journalist Registration
const addIssue = (req, res) => {
  console.log("mid",req.body.mid);
  let mid=null
  
  if((req.body.mid)=="")
  mid=null
else
mid=req.body.mid

    let date=new Date()
    const newjournalist = new critical({
      msg: req.body.msg, // ok
      date: date,//ok
      jid: req.params.id,//ok
      mid: mid,//ok
      latitude: req.body.latitude,//ok
      longitude: req.body.longitude,//ok
      freelancer: req.body.freelancer//ok
     
    });
    newjournalist
      .save()
      .then((data) => {
        res.json({
          status: 200,
          msg: "Inserted successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 500,
          msg: "Data not Inserted",
          Error: err,
        });
      });
  };
  //critical Registration -- finished

//View all issues by admin

const viewCriticalIssues = (req, res) => {

    critical
      .find({isactive:true,freelancer:true })
      .populate("jid")
      .exec()
      .then((data) => {
        if (data.length > 0) {
          
          res.json({
            status: 200,
            msg: "Data obtained successfully",
            data: data,
          });
        } else {
          res.json({
            status: 200,
            msg: "No Data obtained ",
            data:data
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg: "Data not Inserted",
          Error: err,
        });
      });
  };
  
  // view journalist finished


  //View all issues by admin

const viewCriticalIssuesByMedia = (req, res) => {

    critical
      .find({isactive:true,mid:req.params.id })
      .populate('jid')
      .exec()
      .then((data) => {
        if (data.length > 0) {
          
          res.json({
            status: 200,
            msg: "Data obtained successfully",
            data: data,
          });
        } else {
          res.json({
            status: 200,
            msg: "No Data obtained ",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg: "Data not Inserted",
          Error: err,
        });
      });
  };
  
  // view journalist finished
//View all issues by admin

const confirmCriticalIssues = (req, res) => {

    critical
      .findByIdAndUpdate({_id:req.params.id },{
        isactive:false
      })
      .exec()
      .then(data => {
        
          res.json({
            status: 200,
            msg: "data updated ",
        
      })
    })
      .catch(err => {
        res.json({
          status: 500,
          msg: "Data not updated",
          Error: err,
        });
    })
}
  
  // view journalist finished


  module.exports={
addIssue,
viewCriticalIssues,
viewCriticalIssuesByMedia,
confirmCriticalIssues
  }