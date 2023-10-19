const journalistSchema = require("../Journalist/journalistSchema");
const planubs = require("../Media/planubs");
const news = require("./newsSchema");
const vnews = require("./videoNews");
const mediaSchema = require("../Media/mediaSchema");
const multer = require("multer");
// const cart = require('../user/cart_model')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

//add news

//view news count by jid

const viewNewsCountByJId = async (jid) => {
  console.log("in viewNewsCountByJId");
  let count = 0;
  await news
    .find({ jid: jid })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        count += data;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  await vnews
    .find({ jid: jid })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        count += data;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return count;
};

const featuredNewses = async (req, res) => {
  try {
    const sortedNews = await news.aggregate([
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $sort: { reviewCount: -1 },
      },
    ]);
    res.json({
      status: 200,
      data: sortedNews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ statu: 500, error: "Failed to sort news by reviews" });
  }
};

const addNews = async (req, res) => {
  let plancount = 0;
  let count = 0;
  console.log("jid : ", req.body.jid, "", req.body.freelancer);
  if (req.body.freelancer == true) {
    count = await viewNewsCountByJId(req.body.jid);
    console.log("count 1", count);
    await planubs
      .findOne({ jid: req.body.jid })
      .populate("planid")
      .exec()
      .then((data2) => {
        plancount = data2.planid.maxCount;
      });
    console.log("plancount 2", plancount);
  } else {
    await viewNewsCountById(req.body.mid).then((data) => {
      count = data;
    });
    console.log("count 2", count);
    await planubs
      .findOne({ mid: req.body.mid })
      .populate("planid")
      .exec()
      .then((data2) => {
        if (data2 != null) {
          console.log(data2);
          plancount = data2.planid.maxCount;
        } else {
          console.log("no plans chosen");
        }
      });
    console.log("plancount 2", plancount);
  }

  if (count < plancount) {
    let images = req.file.filename;
    let date = new Date();
    const newNews = new news({
      title: req.body.title,
      loc: req.body.loc,
      content: req.body.content,
      date: date,
      jid: req.body.jid,
      category: req.body.category,
      image: images,
      freelancer: req.body.freelancer,
      mid: req.body.mid,
    });
    newNews
      .save()
      .then((data) => {
        console.log("added");
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
  } else {
    res.json({
      status: 500,
      msg: "You have exceeded the max limit as per your subscr",
    });
  }
};

//update  by id
const editNewsById = (req, res) => {
  news
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        loc: req.body.loc,
        content: req.body.content,

        jid: req.body.jid,
        mid: req.body.mid,
        category: req.body.category,
        image: req.file,
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

const viewNewsById = (req, res) => {
  news
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

const delNewsById = (req, res) => {
  news
    .findOneAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => {
      console.log(data);
      res.json({
        status: 200,
        msg: "Data removed successfully",
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

const viewNewsByCategory = async (req, res) => {
  let blocked = [];
  let mblocked = [];

  await journalistSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          blocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });

  await mediaSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          mblocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
  news
    .find({
      category: req.params.category,
      isactive: true,
      jid: { $nin: blocked },
      mid: { $nin: mblocked },
    })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "No Data obtained",
        });
      }
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

const viewNewsForHome = async (req, res) => {
  let dataas = [];
  let blocked = [];
  let mblocked = [];

  await journalistSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          blocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });

  await mediaSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          mblocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });

  await news
    .find({ isactive: true, jid: { $nin: blocked }, mid: { $nin: mblocked } })
    .sort({ date: -1 })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        res.json({
          status: 200,
          msg: "No Data obtained ",
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
const viewNewsByMedia = (req, res) => {
  news
    .find({ mid: req.params.id, isactive: true })
    .sort({ date: -1 })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "No Data obtained",
        });
      }
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

const viewNewsByJournalist = (req, res) => {
  news
    .find({ jid: req.params.id, isactive: true })
    .sort({ date: -1 })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "No Data obtained",
        });
      }
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

//view News Reqs for media

const viewNewsReqMedia = (req, res) => {
  news
    .find({ mid: req.params.mid, isactive: false })
    .sort({ date: -1 })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "No Data obtained",
        });
      }
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
//Approve news by media
const updateNewsByMedia = (req, res) => {
  news
    .findByIdAndUpdate(
      { _id: req.params.nid },
      {
        isactive: true,
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

//view News Reqs for media

const viewFreelancerNewsReqAdmin = (req, res) => {
  news
    .find({ freelancer: true, isactive: false })
    .sort({ date: -1 })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        console.log(data);
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 500,
          msg: "No Data obtained",
        });
      }
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
//Approve news by media
const updateNewsByAdmin = (req, res) => {
  news
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        isactive: true,
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

// add reviews by public
const addComment = (req, res) => {
  let review = req.body.comments;
  let arr = [];
  news
    .findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      arr = data.reviews;
      arr.push(review);
      console.log(arr);
      news
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
//view news count by mid

const viewNewsCountById = async (mid) => {
  let count = 0;
  await news
    .countDocuments({ mid: mid })
    .exec()
    .then((data) => {
      console.log("in fun", mid, data);
      count += data;
    })
    .catch((err) => {
      console.log(err);
    });

  await vnews
    .countDocuments({ mid: mid })
    .exec()
    .then((data) => {
      console.log("in fun", mid, data);
      count += data;
    })
    .catch((err) => {
      console.log(err);
    });

  return count;
};

//View all news most reviews

const viewNewseswithreviews = async (req, res) => {
  let pcount = 0;
  let test = ["good", "positive", "super"];
  let arr = await news.aggregate([
    {
      $match: { isactive: true }, // Filter by isactive: true
    },
    {
      $project: {
        title: 1,
        date: 1,
        jid: 1,
        mid: 1,
        loc: 1,
        content: 1,
        category: 1,
        image: 1,
        isactive: 1,
        freelancer: 1,
        reviews: 1,
        reviewLength: { $size: "$reviews" }, // Add a field for review length
      },
    },
    {
      $sort: { reviewLength: -1 }, // Sort by review length in ascending order
    },
    {
      $limit: 5, // Limit the result to 5 news articles
    },
  ]);
  console.log(arr);

  res.json({
    status: 200,
    msg: "Data obtained successfully",
    data: arr,
  });
};

//View all news

const viewNewses = async (req, res) => {
  let blocked = [];
  let mblocked = [];

  await journalistSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          blocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });

  await mediaSchema
    .find({ blocked: true })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.map((x) => {
          mblocked.push(x._id);
        });
      } else {
        console.log("no data obtained");
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });

  await news
    .find({ isactive: true, jid: { $nin: blocked }, mid: { $nin: mblocked } }).sort({date:-1})
    .exec()
    .then((data) => {
      if (data.length > 0) {
        res.json({
          status: 200,
          msg: "No Data obtained ",
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

// view  finished

module.exports = {
  addNews,
  addComment,
  viewNewsById,
  viewNewses,
  editNewsById,
  delNewsById,
  viewNewsByCategory,
  viewNewsForHome,
  viewNewsByMedia,
  viewNewsByJournalist,
  upload,
  updateNewsByMedia,
  viewNewsReqMedia,
  updateNewsByAdmin,
  viewFreelancerNewsReqAdmin,
  viewNewsCountById,
  featuredNewses,
  viewNewseswithreviews,
};
