const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

// schema for model quiteLocation
const quietLoc = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  category: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
});

// delete middleware that deletes reviews belongs to a quiet location
// when the location is deleted
quietLoc.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("quietLoc", quietLoc);
