const { UserDB } = require("../../models/user");

// home page
exports.home = (req, res) => {
  res.render("home");
};

// welcome page
exports.welcome = (req, res) => {
  res.render("welcome");
};

// signup page
exports.signup = (req, res) => {
  res.render("signup");
};

// login page
exports.login = (req, res) => {
  res.render("login");
};

// admin login page
exports.admin = (req, res) => {
  res.render("admin");
};

// create todo page
exports.todo = (req, res) => {
  res.render("todo");
};

// admin dashboard
exports.adminDashboard = (req, res) => {
  res.render("adminDashboard");
};

// userdashboard
exports.userDashboard = (req, res) => {
  res.render("userDashboard");
};

// user CURD operation
// create and save new user
exports.createUser = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  // new user
  const newUser = new UserDB({
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    status: "active",
  });

  // save user in the database
  newUser
    .save()
    .then((data) => {
      // res.send(data);
      localStorage.setItem("user", data);
      res.redirect("/userDashboard");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating a create operation",
      });
    });
};

// get users
exports.getAllUsers = (req, res) => {
  UserDB.find()
    .then((users) => {
      res.render("users", { users }); // Render the EJS file with the users data
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users"); // Handle the error appropriately
    });
};

// update user
exports.updateUser =  (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  UserDB.findByIdAndUpdate(id, { name, age }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }

      res.send(updatedUser);
    })
    .catch((error) => {
      res.status(500).send('Error updating user');
    });
};

// delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send('User not found');
      }

      res.send(deletedUser);
    })
    .catch((error) => {
      res.status(500).send('Error deleting user');
    });
};