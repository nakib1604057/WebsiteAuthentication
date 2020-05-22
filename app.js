const express = require("express");
const path = require("path");
const bosyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const allRoutes = require("./routes/allRoutes.js");
const userdb = require("./models/userdbmodle.js");
const passport = require("passport");
const localStregy = require("passport-local").Strategy;
const app = express();
// for config page we need dotenv
dotenv.config({ path: "./config.env" });
// coonecting to database using monogoose
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log("database connected successfully");
  });
// creating session
app.use(
  session({
    secret: "create new authentication",
    resave: true,
    saveUninitialized: true,
  })
);
// now using flash for session to work
app.use(flash());
// using passport for password authentication
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.err_msg = req.flash("err_msg");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  next();
});

passport.use(
  new localStregy({ usernameField: "usrName" }, userdb.authenticate())
);
passport.serializeUser(userdb.serializeUser());
passport.deserializeUser(userdb.deserializeUser());
app.use(express.static("include"));
//body aprser for post request
app.use(bosyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(allRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server Started successfully now");
});
