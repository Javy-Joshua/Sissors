const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
const ObjectID = mongoose.ObjectID;

const HistorySchema = new Schema({
  Id: {
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
    type: Schema.Types.ObjectId,
    // default: uuid.v4(),
    required: true,
    ref: "users",
  },
});

const HistoryModel = mongoose.model("historys", HistorySchema);

module.exports = HistoryModel;
