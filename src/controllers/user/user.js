const { UserDB } = require("../../models/user");


// user CURD operation
// create and save new user
exports.createUser = async (req, res) => {
  // validate request
  const {username, email} = req.body;
  const user = await UserDB.find({
    $or: [{ email: email }, { username: username }],
  });

  if(user.length > 0)
  {
    const message = "****** Username or email already exists ******";
    res.render("signup", { message })
  }

  if (!req.body) {
    const message = "****** Content can not be empty ******";
    res.render("signup", { message });
    return;
  }

  // new user
  const newUser = new UserDB({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    status: "active",
    privilege: "user",
  });

  // save user in the database
  newUser
    .save()
    .then((data) => {
      const username = data.username;
      const privilege = data.privilege;
      const lastlogin = data.lastlogin;
      res.cookie("username", username);
      res.cookie("password", lastlogin);
      res.cookie("privilege", privilege);
      res.redirect("/userDashboard");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating a create operation",
      });
    });
};

// get all users
exports.getAllUsers = (req, res) => {
  UserDB.find()
    .then((users) => {
      res.render("users", { users }); // Render the EJS file with the users data
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users"); // Handle the error appropriately
    });
};

// get user by id
exports.getUserByID = (req, res) => {
  const userId = req.params.id;
  UserDB.findById(userId)
    .then((user) => {
      res.render("editUser", { user });
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      res.status(500).send("Error retrieving user");
    });
};

// update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  UserDB.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.redirect("/users");
    })
    .catch((error) => {
      res.status(500).send("Error updating user");
    });
};

// delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  UserDB.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
      res.redirect("/users");
    })
    .catch((error) => {
      res.status(500).send("Error deleting user");
    });
};

// get all username
exports.getAllUsername = (req, res) => {
  const adminUser = req.cookies.username;
  UserDB.find()
    .then((users) => {
      res.render("todoCreate", { users, adminUser }); // Render the EJS file with the users data
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users"); // Handle the error appropriately
    });
};

// user login
exports.userLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;

  // Find the user by username
  const user = await UserDB.find({
    $or: [{ email: text }, { username: text }],
  });

  if (user.length == 0) {
    res.render("login", { message: "****** User not found ******" });
    return;
  } else {
    if (password == user[0].password) {
      user[0].privilege = "user";

      const username = user[0].username;
      const privilege = user[0].privilege;
      const lastlogin = user[0].lastlogin;

      // session
      session=req.session;
      req.session.loggedIn = true;
      console.log(req.session);
    
      // cookies
      res.cookie("username", username);
      res.cookie("lastlogin", lastlogin);
      res.cookie("privilege", privilege);

      if(req.session.loggedIn)
      {
        res.redirect("/userDashboard");
      }
      else{
        res.redirect("/login");
      }
     
    } else {
      const message = "****** Invalid username or email ******";
      res.render("login", { message });
      return;
    }
  }
};
