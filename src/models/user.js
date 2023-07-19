const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email id already exist"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    privilege: {
      type: String,
    },
    lastlogin: {
      type: Date,
      default: Date.now()
    },
  },
  { timestamps: true }
);

// we will create a new collection
const UserDB = new mongoose.model("User", userSchema);

module.exports = { UserDB };
