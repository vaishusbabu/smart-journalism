const public = require("./pubSchema");
const jwt = require("jsonwebtoken");

const secret = "your-secret-key"; // Replace this with your own secret key

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
};

const nodemailer = require("nodemailer");
const savedNewses = require("./savedNewses");

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
    text: `Please use the Key to continue regigistration to your Newseeker Account , Key :${key}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Registration

const registerPublic = (req, res) => {
  const newStudent = new public({
    name: req.body.name,

    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
  });
  newStudent
    .save()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Registered successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "Data not Registered",
        Error: err,
      });
    });
};
// Registration -- finished

//Login Parent
const login = (req, res) => {
  const { email, password } = req.body;

  public
    .findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "User not found" ,alert:"User not found"});
      }

      if (user.password != password) {
        return res.status(500).json({ msg: "incorrect pwd" ,alert :"Invalid Password"});
      }

      const token = createToken(user);

      res.status(200).json({ user, token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: "Something went wrong" });
    });
};
//validate

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  console.log("t1", token);
  console.log("secret", secret);
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    console.log(decodedToken);
    if (err) {
      return res.status(401).json({ messamsgge: "Unauthorized", err: err });
    }

    req.user = decodedToken.userId;
    next();
    return res.status(200).json({ msg: "ok", user: decodedToken.userId });
  });
  console.log(req.user);
};

//Login Parent --finished

//View all Publics

const viewPublic = (req, res) => {
  public
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

// view Parents finished

//update Parent by id
const editPublicById = (req, res) => {
  public
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
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
      console.log(err);
      res.json({
        status: 500,
        msg: "Data not Updated",
        Error: err,
      });
    });
};

//View  Public by ID

const viewPublicById = (req, res) => {
  public
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

//Public forgot password
const forgotPassword = (req, res) => {
  public
    .findOne({ email: req.body.email })
    .exec()
    .then((data) => {
      if (data == null) {
        res.json({
          status: 500,
          msg: "User not Found",
        });
      } else {
        public
          .findOneAndUpdate(
            { email: req.body.email },
            {
              password: req.body.password,
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
      }
    });
};

// view Parent by id
const deletePublicById = (req, res) => {
  public
    .findByIdAndDelete({ _id: req.params.id })
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
};

//Send key via mail

const sendKey = (req, res) => {
  public
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      let key = data._id.toString().slice(20, 24);
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
  public
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      let key1 = data._id.toString().slice(20, 24);
      console.log(key, " ", key1);
      if (key == key1) {
        public
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


//Save News

const saveNews =async (req, res) => {
  let flag = 0;
  await savedNewses
    .find({ pid: req.params.id, nid: req.body.id })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        flag = 1;
      }
    });


  if (flag == 0) {
    let date = new Date();
    const newStudent = new savedNewses({
      pid: req.params.id,
      nid: req.body.id,
      date: date,
    });
    await newStudent
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
  } 
  
  else {
    res.json({
      status: 500,
      msg: "Already in your saved list",
    });
  }
};
// save  -- finished

//View  Public saved newses

const viewSavedNewsByPid = (req, res) => {
  savedNewses
    .find({ pid: req.params.id })
    .populate("pid")
    .populate("nid")
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

//delete saved newses

const deleteSavedNews = (req, res) => {
  savedNewses
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
  registerPublic,
  login,
  viewPublicById,
  editPublicById,
  viewPublic,
  deletePublicById,
  forgotPassword,
  sendKey,
  verifyKey,
  saveNews,
  viewSavedNewsByPid,
  deleteSavedNews,
};
