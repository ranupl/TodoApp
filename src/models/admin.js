const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
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
      type: String,
    },
  },
  { timestamps: true }
);

// we will create a new collection
const AdminDB = new mongoose.model("Admin", adminSchema);

module.exports = { AdminDB };
