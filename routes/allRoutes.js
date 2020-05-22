const express = require("express");
const passport = require("passport");
const userdb = require("../models/userdbmodle.js");
const crypto = require("crypto");
const async = require("async");
const nodemailer = require("nodemailer");
const routes = express.Router();
// check user authenticated
function isUserAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("err_msg", "Please Login");
  res.redirect("/login");
}
routes.get("/", (req, res) => {
  res.render("index");
});
routes.get("/blog", isUserAuthenticated, (req, res) => {
  res.render("blog");
});
routes.get("/signup", (req, res) => {
  res.render("singup");
});
routes.get("/login", (req, res) => {
  res.render("login");
});
routes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Please try again ,Password or username may be worng",
  })
);
routes.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword");
});
//forget password post
routes.post("/forgetpassword", (req, res) => {
  let { username, email } = req.body;

  userdb
    .findOne({ $and: [{ usrName: username }, { usrEmail: email }] })
    .then((user) => {
      if (!user) {
        req.flash("err_msg", "Please Give valid username and email");
        res.redirect("/forgetpassword");
      } else {
        // we have that user now send mail to user
        async.waterfall(
          [
            (done) => {
              crypto.randomBytes(30, (err, buff) => {
                let token = buff.toString("hex");
                done(err, token);
              });
            },
            (token, done) => {
              user.resetPasswordToken = token;
              user.expireTime = Date.now() + 1800000; //for 30 min
              user.save((err) => {
                done(err, token, user);
              });
            },
            (token, user) => {
              let smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASS,
                },
              });
              let mailoption = {
                to: user.usrEmail,
                from: "Akrma hossain",
                subject: "Recover Password",
                text:
                  "click this link to recover password /n/n" +
                  "http://" +
                  req.headers.host +
                  "/recover/password/" +
                  token,
              };
              smtpTransport.sendMail(mailoption, (err) => {
                req.flash("success_msg", "Email is send to your account");
                res.redirect("/forgetpassword");
              });
            },
          ],
          (err) => {
            if (err) res.render("/forgetpassword");
          }
        );
      }
    })
    .catch((err) => {
      res.redirect("/forgetpassword");

      console.log(err);
    });
});
routes.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Successfully logout from the system");
  res.redirect("/");
});
routes.get("/add/new/user", (req, res) => {
  res.render("singup");
});
routes.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  let userData = {
    usrName: name,
    usrEmail: email,
  };
  let userPassword = password;
  userdb.register(userData, userPassword, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("err_msg", "ERROR: " + err);
      res.redirect("/signup");
    }

    passport.authenticate("local");
    console.log("sdfsf2");
    req.flash("success_msg", "Account created successfully");
    res.redirect("/login");
  });
});

module.exports = routes;
