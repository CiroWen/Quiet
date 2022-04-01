const express = require("express");
const reviewRoute = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const asyncCatch = require("../utils/AsyncCatch");
const QuietLoc = require("../models/quietLoc");
const Review = require("../models/review");


reviewRoute.post(
  "/",
  asyncCatch(async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    const id = req.params.id;
    const p = await QuietLoc.findById(id);
    const r = await new Review({
      body: req.body.review.body,
      rating: req.body.review.rate,
    });
    await p.reviews.push(r);
    console.log(p);
    await p.save();
    await r.save();
    // Both model requires save() otherwise it won't shows on its own collections
    // i.e. if only p is saved. the review will appear at p while won't appear
    // at collection review
    res.redirect(`/quietplaces/${p._id}`);
  })
);
reviewRoute.delete(
  "/:reviewId/delete",
  asyncCatch(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(req.params);
    await QuietLoc.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // $pull removes all matching document within the array
    // w/o pulling, the _id of review will remain in quietLoc.
    const r = await Review.findOneAndDelete(reviewId);
    res.redirect(`/quietplaces/${req.params.id}`);
  })
);

module.exports = reviewRoute;
