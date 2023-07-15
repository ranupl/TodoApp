const { UserDB } = require("../../models/user");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./todoStorage');

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
    firstname: req.body.firstname,
    lastname: req.body.lastname,
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

// user login
exports.userLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;
  // console.log(text);

  // Find the user by username
  const user = await UserDB.find({
    $or: [{ email: text }, { username: text }],
  });

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  if (password == user[0].password) {
    let currentUser = user[0]._doc;
    currentUser.role="user"
  
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    res.redirect("/userDashboard");
  } else {
    res.status(400).json({ message: "Invalid username or email" });
    return;
  }
};

