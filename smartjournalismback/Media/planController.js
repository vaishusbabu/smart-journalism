const plans = require("./plansSchema");
const planubs = require("./planubs");

//journalist Registration

const register = (req, res) => {
  const newPlan = new plans({
    name: req.body.name,
    maxCount: req.body.maxCount,
    cost: req.body.cost,
    days: req.body.days,
  });
  newPlan
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
//newPlan Registration -- finished

//View all Media

const viewPlans = (req, res) => {
  plans
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
const editPlanById = (req, res) => {
  plans
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,

        maxCount: req.body.maxCount,

        cost: req.body.cost,
        days: req.body.days,
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

//view Plan by id

const viewPlanById = (req, res) => {
  plans
    .findById({ _id: req.params.id })
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

//del plan by id

const delPlanById = (req, res) => {
  plans
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

//del plan by id

const subscribePlan = async (req, res) => {
  let date = new Date();
  let exp = new Date();

  await plans
    .findById({ _id: req.body.planid })
    .exec()
    .then((data) => {
      exp.setDate(date.getDate() + data.days);
      console.log(exp, ",", date.getDate(), ",", data.days);
    });
  const newPlan = new planubs({
    planid: req.body.planid,
    usrType: req.body.usrType,
    mid: req.body.mid,
    jid: req.body.jid,
    date: date,
    expiry: exp,
  });
  await newPlan
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

//view Subsription by mid

const viewSubByMId = (req, res) => {
  planubs
    .find({ mid: req.params.id })
    .populate("planid")
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

const viewSubByJId = (req, res) => {
  planubs
    .find({ jid: req.params.id })
    .populate("planid")
    .populate('jid')
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
  register,
  viewPlanById,
  viewPlans,
  delPlanById,
  subscribePlan,
  editPlanById,
  viewSubByMId,
  viewSubByJId
};
