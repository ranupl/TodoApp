const mongoose = require("mongoose");


// const databaseURL = "mongodb://localhost:27017/todoApp";
const databaseURL = "mongodb://127.0.0.1:27017/todoApp";

mongoose
  .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
