const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
require("./db/connection");

// env file configure
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8000;

// body parser
app.use(bodyparser.urlencoded({ extended: true }));

// view engine set
app.set("view engine", "ejs");

// path resolve
app.use("/css", express.static(path.resolve(__dirname, "css")));
app.use("/images", express.static(path.resolve(__dirname, "images")));

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// welcome page
app.get("/welcome", (req, res) => {
  res.render("welcome");
});

// signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// login page
app.get("/login", (req, res) => {
  res.render("login");
});

// admin login page
app.get("/admin", (req, res) => {
  res.render("admin");
});

// create todo page
app.get("/todo", (req, res) => {
  res.render("todo");
});

// admin dashboard
app.get("/adminDashboard", (req, res) => {
  res.render("adminDashboard");
});

//todo update
app.get("/updateTodo", (req, res) => {
  res.render("updateTodo");
});

// user update
app.get("/editUser", (req, res) => {
  res.render("editUser");
});

// edit admin 
app.get("/editAdmin", (req, res) => {
  res.render("editAdmin");
});

// all routes
const userCon = require("./src/controllers/user/user");
const todoCon = require("./src/controllers/todo/todo");
app.get("/userDashboard", todoCon.getAllTasks);

// all about user
app.post("/users", userCon.createUser);
app.get("/users", userCon.getAllUsers);
app.get("/users/:id", userCon.getUserByID);
app.post("/users/update/:id", userCon.updateUser);
app.get("/users/delete/:id", userCon.deleteUser);

// user login
app.post("/users/login", userCon.userLogin);

// all about todo
app.post("/todo", todoCon.createTask);
app.get("/todo", todoCon.getAllTasks);
app.get("/todo/:id", todoCon.getTaskById);
app.get("/todo/edit/:id", todoCon.editTask);
app.post("/todo/update/:id", todoCon.updateTask);
app.get("/todo/delete/:id", todoCon.deleteTask);

const adminCon = require("./src/controllers/admin/admin");

// admin routes
app.post("/admin/login", adminCon.adminLogin);
app.post("/admin/update", adminCon.adminUpdate);


app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
