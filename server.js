const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const router = require("./src/routers/router");
require("./db/connection");
// const userController = require("./src/controllers/userController");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8000;

// body parser
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use("/css", express.static(path.resolve(__dirname, "css")));
app.use("/images", express.static(path.resolve(__dirname, "images")));

app.use("/", router);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/welcome", (req, res) => {
  res.render("welcome");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.get("/signup", userController.createUser);
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/userDashboard", (req, res) => {
  res.render("userDashboard");
});

app.get("/todo", (req, res) => {
  res.render("todo");
});

app.get("/adminDashboard", (req, res) => {
  res.render("adminDashboard");
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
