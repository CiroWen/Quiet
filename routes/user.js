/**
 * Route for user
 */
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
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "You have successifully registered! Welcome!");
        res.redirect("/quietplaces");
      });
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
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }), //second params as middleware
  (req, res) => {
    req.flash("success", "Welcome back!");
    const ogUrl = req.session.bkUrl || "/quietplaces";
    console.log("in login post");
    res.redirect(ogUrl);
  }
);

userRoute.get("/logout", (req, res) => {
  // console.log(req.user);
  req.logOut();
  req.flash("success", "You have successifully logged out.");
  res.redirect("/quietplaces");
});
module.exports = userRoute;
