const mongoose = require("mongoose");

const mSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    unique: true,
    required: true,

    dropDups: true,
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
  verified: {
    type: Boolean,
    default: false,
  },
  img: Object,
  web: String,
  address: {
    type: String,
    required: true,
  },
  blocked:{
    type: Boolean,
    default: false,
  }
});
module.exports = mongoose.model("medias", mSchema);
