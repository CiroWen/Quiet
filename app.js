const express = require("express"); //web framework.
const app = express();
const path = require("path"); //for building directory, join() swap \ / based on different OS
const mongoose = require("mongoose"); //driver to connect MongoDb
const methodOverride = require("method-override"); //a middleware that allows client-side to make  PUT and DELETE request via form(can only make POST),
const asyncCatch = require("./utils/AsyncCatch"); //a untility function that returns the original function with catch(next) following it.
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError"); //customized error class
const placeRoute = require("./routes/quietplaces"); //router for /quietplaces
const reviewRoute = require("./routes/review"); //router for /quietplaces/:id/reviews
const userRoute = require("./routes/user"); //router for /user
const session = require("express-session"); //stores info on server side, like the login status of user.
const flash = require("connect-flash"); //middleware for template flash
const port = process.env.PORT || 3000;
const passport = require("passport"); //possess the login user across all different requests
const LocalStrategy = require("passport-local"); //identify the passport authentication strategy - local, there are many different other strategy such as Google, facebook, twitter and amazon. 
const User = require("./models/user");
const sessionConfig = {
  secret: "AlegitsecretForSession", //signature on server side
  resave: false, //force to resave the session, though it might be unchanged
  saveUninitialized: true, //save uninitialized session,
  cookie: {
    httpOnly: true,
    // prevent from being accessed through client side
    expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false, //default value, true means only https can access the cookie
  },
};

mongoose.connect("mongodb://localhost:27017/quiet", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
// the use of error.bind?
db.once("open", (err) => {
  if (err) {
    console.log("connection error");
    next(new ExpressError("Database is disconnected", 404));
  } else {
    console.log("connection success");
  }
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // use() executes its' params on every request
app.use(express.urlencoded({ extended: true })); // setup the application/x-www-form-urlencode parser, parses input="obj[prop] to obj{prop:value}"
app.use(methodOverride("_method")); // override method with header '_method'
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash()); //setup flash middleware
app.use(passport.initialize());
app.use(passport.session()); // identify users
passport.use(new LocalStrategy(User.authenticate())); //??
passport.serializeUser(User.serializeUser()); //??
passport.deserializeUser(User.deserializeUser()); //??

// middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user; //stores the current user
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/quietplaces", placeRoute);
app.use("/quietplaces/:id/reviews", reviewRoute);
app.use("/user", userRoute);
// // home page of Quiet
app.get("/", (req, res) => {
  console.log(req.body);
  console.log(req.params);
  console.log("=================================");
  console.log(res.body);
  res.render("home.ejs");
});

// for testing purpose, shortcut making account
app.get("/fake", async (req, res) => {
  const user = new User({ email: "1@gmail.com", username: "1" });
  const newU = await User.register(user, "1");
  res.send(newU);
});

// error handling middleware
// app.use((err, req, res, next) => {
//   //   res.send(`unknown error, please try again.`);
//   next(new ExpressError("Page is down", 404));
//   // next(new ExpressError())
//   // next() triggers the next middleware below.
// });

app.all("*", (req, res, next) => {
  next(new ExpressError("Page is not found, please try again.", 404));
});
// simply error handling of page not found, (without a router)
app.use((err, req, res, next) => {
  const {
    status = 500,
    msg = "Unknown error occurred, please try again or contact us.",
  } = err;
  res.status(status).render("quietPlace/error", { err });
  console.log(`next is executed`);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
