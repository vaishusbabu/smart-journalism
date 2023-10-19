const journalist = require("./journalistSchema");
const nodemailer = require("nodemailer");

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "newseekervsb@gmail.com",
    pass: "amipdtkxmvicpcnf",
  },
});

const testMail = (user, key) => {
  const mailOptions = {
    from: "newseekervsb@gmail.com",
    to: user,
    subject: "User Verification By NewSeeker",
    text: `Please use the Key to continue registration to your Newseeker Account , Key :${key}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("img");

//journalist Registration

const registerJournalist = (req, res) => {
  const newjournalist = new journalist({
    name: req.body.name,
    gender: req.body.gender,
    city: req.body.city,
    contact: req.body.contact,
    email: req.body.email,
    password: req.body.password,
    bloodgroup: req.body.bloodgroup,
    age: req.body.age,
    address: req.body.address,
    highesteducation: req.body.highesteducation,
    img: req.file,
    freelancer: true,
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
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};
//newjournalist Registration -- finished

//Login journalist
const loginJournalist = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  journalist
    .findOne({ email: email, verified: true })
    .exec()
    .then((data) => {
      if (password == data.password) {
        res.json({
          status: 200,
          msg: "Login successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "password Mismatch",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "User not found",
        Error: err,
      });
    });
};

//Login packers --finished

//Send key via mail

const sendKey = (req, res) => {
  journalist
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      let key = data._id.toString().slice(18, 24);
      testMail(data.email, key);

      res.json({
        status: 200,
        msg: "Data send successfully",
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

//Verify key

const verifyKey = (req, res) => {
  let key = req.body.key;
  journalist
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      let key1 = data._id.toString().slice(18, 24);
      console.log(key, " ", key1);
      if (key == key1) {
        journalist
          .findByIdAndUpdate({ _id: req.params.id }, { verified: true })
          .exec()
          .then((data1) => {
            res.json({
              status: 200,
              msg: "Data send successfully",
              data: data1,
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
      } else {
        res.json({
          status: 500,
          msg: "Data not verified",
        });
      }
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
//View all journalists

const viewJournalists = (req, res) => {
  journalist
    .find({ isactive: true, verified: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.forEach((x) => {});
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

//update journalist by id

const editJournalistById = (req, res) => {
  journalist
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        gender: req.body.gender,
        city: req.body.city,
        contact: req.body.contact,
        email: req.body.email,
        empid: req.body.empid,
        bloodgroup: req.body.bloodgroup,
        age: req.body.age,
        address: req.body.address,

        highesteducation: req.body.highesteducation,
        img: req.file,
      }
    )
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Updated successfully",
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Updated",
        Error: err,
      });
    });
};
const viewJournalistById = (req, res) => {
  journalist
    .findOne({ _id: req.params.id })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};
// add journalist by media

const addJournalistByMedia = (req, res) => {
  const newjournalist = new journalist({
    name: req.body.name,
    gender: req.body.gender,
    city: req.body.city,
    contact: req.body.contact,
    email: req.body.email,
    password: req.body.password,
    empid: req.body.empid,
    freelancer: false,
    mid: req.params.id,
    isactive: true,
    bloodgroup: req.body.bloodgroup,
    age: req.body.age,
    address: req.body.address,
    highesteducation: req.body.highesteducation,
    img: req.file,
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
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};
//newjournalist Registration -- finished
//newjournalist Registration -- finished
//view Journalist by media

const viewFreelancerReqs = (req, res) => {
  journalist
    .find({ freelancer: true, isactive: false, verified: true })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};

//Approve by media

const approveFreelancer = (req, res) => {
  journalist
    .findByIdAndUpdate({ _id: req.params.id }, { isactive: true })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};

// Block a journalist

const blockFreelancer = (req, res) => {
  journalist
    .findByIdAndUpdate({ _id: req.params.id }, { blocked: true })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};

// Block a journalist

const unBlockFreelancer = (req, res) => {
  journalist
    .findByIdAndUpdate({ _id: req.params.id }, { blocked: false })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};



// view Blocked  journalists

const viewBlockedJournalists = (req, res) => {
  journalist
    .find({ blocked: true,isactive:true,verified:true })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};


//admin view all frelance r reqs

const viewJournalistByMId = (req, res) => {
  journalist
    .find({ mid: req.params.id, verified: true })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};

//del Journalist by id

const delJournalistById = (req, res) => {
  journalist
    .findByIdAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};
module.exports = {
  registerJournalist,
  sendKey,
  loginJournalist,
  viewJournalists,
  viewFreelancerReqs,
  approveFreelancer,
  editJournalistById,
  viewJournalistById,
  delJournalistById,
  viewJournalistByMId,
  addJournalistByMedia,
  verifyKey,
  upload,
  blockFreelancer,
  unBlockFreelancer,
  viewBlockedJournalists
};
