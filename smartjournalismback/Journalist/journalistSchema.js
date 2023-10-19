const mongoose = require("mongoose");

const journalistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  empid: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  freelancer: {
    type: Boolean,
    default: true,
  },
  isactive: {
    type: Boolean,
    default: false,
  },
  mid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "medias",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  bloodgroup: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  highesteducation: {
    type: String,
    required: true,
  },
  img: Object,
  
  blocked: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("journalists", journalistSchema);
