const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
const ObjectID = mongoose.ObjectID;

const UrlSchema = new Schema({
  ID: {
    type: String,
    default: uuid.v4(),
    required: true,
  },
  OriginalUrl: {
    type: String,
    required: true,
  },
  ShortUrl: {
    type: String,
    required: true,
  },
  ClickCount: {
    type: Number,
    required: true,
  },
  ClickLocation: {
    type: Array,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  //   user_id: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: "users",
  //   },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

const UrlModel = mongoose.model("Urls", UrlSchema);

module.exports = UrlModel;
