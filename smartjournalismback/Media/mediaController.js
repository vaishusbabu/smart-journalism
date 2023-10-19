const medias = require("./mediaSchema");
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

//media Registration

const registerMedia = (req, res) => {
  const newMedia = new medias({
    name: req.body.name,
    regNo: req.body.regNo,
    contact: req.body.contact,
    email: req.body.email,
    password: req.body.password,
    web: req.body.web,
    address: req.body.address,
    img: req.file,
    
  });
  newMedia
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
//newMedia Registration -- finished

//Login Media
const loginMedia = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  medias
    .findOne({ email: email })
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

//Login Media --finished

//View all Media

const viewMedias = (req, res) => {
  medias
    .find()
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

// view Media finished

//update Media by id
const editMediaById = (req, res) => {
  medias
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        regNo: req.body.regNo,
        web: req.body.web,
        address: req.body.address,
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



//update Media by id
const blockMediaByAdmin = (req, res) => {
  medias
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        blocked:true
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



//unblock Media by id
const unBlockMediaByAdmin = (req, res) => {
  medias
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        blocked:false
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

//view Media by id

const viewMediaById = (req, res) => {
  medias
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

//view blocked medias

const viewBlockedMedias = (req, res) => {
  medias
    .find({ blocked: true,verified:true })
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



//Send key via mail

const sendKey = (req, res) => {
  medias
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
  medias
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      let key1 = data._id.toString().slice(18, 24);
      console.log(key, " ", key1);
      if (key == key1) {
        medias
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

module.exports = {
  registerMedia,
  loginMedia,
  viewMediaById,
  editMediaById,
  viewMedias,
  sendKey,
  verifyKey,
  upload,
  blockMediaByAdmin,unBlockMediaByAdmin,
  viewBlockedMedias
};
