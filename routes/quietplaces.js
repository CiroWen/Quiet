const express = require("express");
const placeRoute = express.Router();
const asyncCatch = require("../utils/AsyncCatch");
const QuietLoc = require("../models/quietLoc");


// content page with all current quiet places
placeRoute.get("/", async (req, res) => {
  const p = await QuietLoc.find({});
  res.render("quietPlace/index.ejs", { p });
});
// page for adding new quiet place
placeRoute.get("/new", (req, res) => {
  // console.log(req.body);
  try {
    res.render("quietPlace/new.ejs");
  } catch (e) {
    next(e);
  }
});
// handle post request on adding new place
placeRoute.post("/new", asyncCatch (async (req, res) => {
    //   console.log(`${req.body} reqbody here`);
    const p = new QuietLoc({
      name: req.body.name,
      city: req.body.city,
      image: req.body.image,
    });
    await p.save();
    req.flash('success','niub')
    res.redirect(`/quietplaces/${p._id}`);
  
  
}));
// detail page for singel quiet place
placeRoute.get(
  "/:id",
  asyncCatch(async (req, res, next) => {
    // the src of img update triggers the get request.
    // that case the req.params.id will be the img url, which is wrong.
    console.log(`${req.params.id} in get ID`);
    const id = req.params.id;
    const p = await QuietLoc.findById(id).populate("reviews");
    if(!p){
      req.flash('error', 'Error here, the location may have been removed')
      return res.redirect('/quietplaces')
    }
    res.render("quietPlace/detail.ejs", { p });
  })
);

// edit page
placeRoute.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const p = await QuietLoc.findById(id);
  if(!p){
    req.flash('error', 'Error here, the location may have been removed')
    return res.redirect('/quietplaces')
  }
  //   const p = await QuietLoc.findById(req.params.id);
  //   console.log('get edit here');
  res.render("quietPlace/edit.ejs", { p });
});
// handle put request on edit page
placeRoute.put("/:id/edit", async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.params);
  // under put method, has access to both req.body and req.params
  try {
    let newP = await QuietLoc.findById(req.params.id);
    newP.name = req.body.name;
    newP.city = req.body.city;
    newP.image = req.body.image;
    await newP.save();
    const p = await QuietLoc.findById(req.params.id);
    res.render("quietPlace/detail", { p });
    console.log(`id/edit is called here`);
  } catch (e) {
    next();
  }
});
placeRoute.delete("/:id/delete", async (req, res) => {
  let { id } = req.params;
  await QuietLoc.findByIdAndDelete(id);
  console.log(`deleted ID :${id}`);
  res.redirect("/quietplaces");
});

module.exports = placeRoute;
