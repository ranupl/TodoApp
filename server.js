const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const userCon = require("./src/controllers/user/user");
const todoCon = require("./src/controllers/todo/todo");
const adminCon = require("./src/controllers/admin/admin");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("./db/connection");
const {
  checkAdminLogin,
  checkUserLogin,
} = require("./src/utils/sessionHelper");
const { UserDB } = require("./src/models/user");

// env file configure
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8000;

// body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

// cookie
app.use(cookieParser());

// session
app.use(
  session({
    secret: "#todo#secure",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// view engine set
app.set("view engine", "ejs");

// path resolve
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/js"));

// Set up Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
  clientID: '393862054267-bcvnu9ejdqkdir06ffd3df9rdoj78i3b.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8000/auth/google/callback',
},
  (accessToken, refreshToken, profile, done) => {
    // You can store user information in a database or use it as needed 
    profile.userEmail = profile.emails[0].value;
    return done(null, profile);
  }));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  done(null, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const email = req.user.userEmail;
    const user = await UserDB.find({email}).lean().exec();
    console.log(user)
    if(user.length === 0)
    {
      const currentDate = new Date();
      var lastlogedin = currentDate.toLocaleTimeString();

      const newUser = new UserDB({
        firstname: req.user?._json?.given_name,
        lastname: req.user?._json?.family_name,
        email: email,
        username: req.user._json ?  req.user._json.name.replace(" ","") : req.user?._json?.given_name,
        password: "googlesignin",
        status: "active",
        privilege: "user",
        lastlogin: lastlogedin,
      });
      newUser.save()
      .then((data) => {
        // session
        req.session;
        req.session.username = data.username;
        req.session.privilege = data.privilege;
        req.session.lastlogin = data.lastlogin;
        res.redirect("/userDashboard"); 
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occured while creating a create operation",
        });
      });
    }
    else{
        // session
        req.session;
        req.session.username = user[0].username;
        req.session.privilege = user[0].privilege;
        req.session.lastlogin = user[0].lastlogin;
      res.redirect("/userDashboard");
    }
  }
);

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
  res.render("nestedModel", { message: undefined });
})

app.get("/adminPasswordModel", (req, res) => {
  res.render("adminPasswordModel", { message: undefined });
})

app.post("/emailForm", userCon.emailForm);
app.post("/otpForm", userCon.otpForm);
app.post("/passwordEdit", userCon.passwordEdit);

app.post("/adminEmailForm", adminCon.adminEmailForm);
app.post("/adminOtpForm", adminCon.adminOtpForm);
app.post("/adminPasswordEdit", adminCon.adminPasswordEdit);

// user logout
app.get("/logout", (req, res) => {
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
app.post("/filter-priority", todoCon.filterByPriority);
app.post("/filter-status", todoCon.filterByStatus);

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
