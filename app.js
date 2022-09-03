const express = require("express"); //web framework
const app = express();
const path = require("path"); //directory management
const mongoose = require("mongoose"); //connect to MongoDb
const methodOverride = require("method-override"); //allows 
const asyncCatch = require("./utils/AsyncCatch");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const placeRoute = require("./routes/quietplaces");
const reviewRoute = require("./routes/review");
const userRoute = require('./routes/user')
const session = require("express-session");
const flash  = require('connect-flash')
const port = process.env.PORT || 3000;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const sessionConfig = {
  secret: "AlegitsecretForSession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // prevent from being accessed through client side
    expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

mongoose.connect("mongodb://localhost:27017/quiet", {
  // ?what are these params doing here
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
// the use of error.bind?
db.once("open", (err) => {
  if (err) {
    console.log("connection error");
  } else {
    console.log("connection success");
  }
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// use() executes its' params on every request
app.use(express.urlencoded({ extended: true }));
// setup the application/x-www-form-urlencode parser
app.use(methodOverride("_method"));
// override method with header '_method'
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res,next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})
app.use("/quietplaces", placeRoute);
app.use("/quietplaces/:id/reviews", reviewRoute);
app.use('/user', userRoute)
// // home page of Quiet
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/fake", async (req, res) => {
  const user = new User({ email: "wewewe@gmail.com", username: "hihi" });
  const newU = await User.register(user, "hihi");
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
  next(new ExpressError("page is down", 404));
});
app.use((err, req, res, next) => {
  const { status = 500, msg = "Unknown error occurred, please try again or contact us." } = err;
  res.status(status).render("quietPlace/error", { err });
  console.log(`next is executed`);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
