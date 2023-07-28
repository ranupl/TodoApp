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
const {
  checkAdminLogin,
  checkUserLogin,
} = require("./src/utils/sessionHelper");

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
app.use(express.static(__dirname + "/js"));

// page routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/welcome", (req, res) => {
  res.render("welcome");
});

app.get("/signup", (req, res) => {
  res.render("signup", { message: undefined });
});

app.get("/login", (req, res) => {
  res.render("login", { message: undefined });
});

app.get("/admin", (req, res) => {
  res.render("admin", { message: undefined });
});

app.get("/editUser", (req, res) => {
  res.render("editUser");
});

app.get("/nestedModel", (req, res) => {
  res.render("nestedModel", {message :undefined});
})

app.post("/emailForm", userCon.emailForm);
app.post("/otpForm", userCon.otpForm);
app.post("/passwordEdit", userCon.passwordEdit);


// user logout
app.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy();
  res.redirect("/welcome");
});

// user routes
app.post("/users", userCon.createUser);
app.get("/users", checkAdminLogin, userCon.getAllUsers);
app.get("/users/:id", checkAdminLogin, userCon.getUserByID);
app.post("/users/update/:id", checkAdminLogin, userCon.updateUser);
app.get("/users/delete/:id", checkAdminLogin, userCon.deleteUser);
app.post("/users/login", userCon.userLogin);
app.get("/search", userCon.searching);

// todo routes
app.post("/todo", checkUserLogin, todoCon.createTask);
app.get("/todo", checkUserLogin, todoCon.getAllTasks);
app.get("/todo/edit/:id", checkUserLogin, todoCon.editTask);
app.post("/todo/update/:id", checkUserLogin, todoCon.updateTask);
app.get("/todo/delete/:id", checkUserLogin, todoCon.deleteTask);
app.get("/userDashboard", checkUserLogin, todoCon.getAllTasks);
app.get("/allTodos", checkAdminLogin, todoCon.getAllTasks);
app.get("/searchTask", todoCon.searching);

// admin routes
app.post("/admin/login", adminCon.adminLogin);
app.post("/admin/update", checkAdminLogin, adminCon.adminUpdate);
app.get("/adminDashboard", checkAdminLogin, adminCon.adminDashboard);

app.post("/limit-data", todoCon.limitedData);
app.post("/limit-user", userCon.limitUserData);

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
