const mongoose = require("mongoose");

const nSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  jid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "journalists",
    required: true,
  },

  mid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "medias",
  },
  isactive: {
    type: Boolean,
    default: false,
  },
  video: {
    type: Object,
  },
  category: {
    type: String,
  },
  content: {
    type: String,
  },
  loc: {
    type: String,
  },
  comments: {
    type: Object,
  },
  freelancer: {
    type: Boolean,
    default: true,
  },
  reviews:{
    type:Array
}
});
module.exports = mongoose.model("videonewses", nSchema);
