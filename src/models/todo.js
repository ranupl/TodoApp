const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 15,
    },
    discription: {
      type: String,
      required: true,
      maxlength: 25,
    },
    priority: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// creating a collection for todos

const Todo = new mongoose.model("Todo", todoSchema);

module.exports = Todo;
