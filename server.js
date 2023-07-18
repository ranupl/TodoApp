const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
require("./db/connection");
const userCon = require("./src/controllers/user/user");
const todoCon = require("./src/controllers/todo/todo");
const adminCon = require("./src/controllers/admin/admin");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// env file configure
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8000;

// body parser
app.use(bodyparser.urlencoded({ extended: true }));

// cookie
app.use(cookieParser());

// session
app.use(
  session({
    secret: "#todo#secure",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 360000 },
  })
);

// view engine set
app.set("view engine", "ejs");

// path resolve
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/images"));

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

// welcome page
app.get("/welcome", (req, res) => {
  res.render("welcome");
});

// signup page
app.get("/signup", (req, res) => {
  res.render("signup", { message: undefined });
});

// login page
app.get("/login", (req, res) => {
  res.render("login", { message: undefined });
});

// admin login page
app.get("/admin", (req, res) => {
  res.render("admin", { message: undefined });
});

// create todo page
app.get("/todo", (req, res) => {
  const uname = req.cookies.username;
  const lastlogin = req.cookies.lastlogin;
  res.render("todo", { uname, lastlogin });
});

// admin dashboard
app.get("/adminDashboard", adminCon.adminDashboard);

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

// todo create
app.get("/todoCreate", userCon.getAllUsername);

// all routes
app.get("/userDashboard", todoCon.getAllTasks);
app.get("/allTodos", todoCon.getAllTasks);

// all about user
app.post("/users", userCon.createUser);
app.get("/users", userCon.getAllUsers);
app.get("/users/:id", userCon.getUserByID);
app.post("/users/update/:id", userCon.updateUser);
app.get("/users/delete/:id", userCon.deleteUser);

// user login
app.post("/users/login", userCon.userLogin);

// user logout
app.get("/logout", (req, res) => {
  // Destroy the session
  if(req.session.destroy()){
    res.redirect('/login');
  }
  
});

// all about todo
app.post("/todo", todoCon.createTask);
app.get("/todo", todoCon.getAllTasks);
app.get("/todo/edit/:id", todoCon.editTask);
app.post("/todo/update/:id", todoCon.updateTask);
app.get("/todo/delete/:id", todoCon.deleteTask);

// admin routes
app.post("/admin/login", adminCon.adminLogin);
app.post("/admin/update", adminCon.adminUpdate);

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
