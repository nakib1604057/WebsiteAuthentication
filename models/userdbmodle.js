const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  usrName: String,
  usrEmail: String,
  userPassword: {
    type: String,
    select: false,
  },
  resetPasswordToken: String,
  expireTime: Date,
});
userSchema.plugin(passportLocalMongoose, { usernameField: "usrName" });
module.exports = mongoose.model("user", userSchema);
