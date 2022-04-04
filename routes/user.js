const express = require("express");
const User = require("../models/user");
const userRoute = express.Router();
const catchAsync = require("../utils/AsyncCatch");
const passport = require("passport");
userRoute.get("/register", (req, res) => {
  res.render("users/register");
});

userRoute.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "You have successifully registered! Welcome!");
      res.redirect("/quietplaces");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/quietplaces");
    }
  })
);

userRoute.get("/login", (req, res) => {
  res.render("users/login");
});

userRoute.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/user/login" }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/quietplaces");
  }
);

userRoute.get("/logout", (req, res) => {
  req.logOut();
  req.flash('success', "You have successifully logged out.")
  res.redirect('/quietplaces')
});
module.exports = userRoute;
