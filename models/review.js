const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
