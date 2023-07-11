const { UserDB } = require("../../models/user");

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
      // localStorage.setItem("user", data);
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
    .then(user => {
      res.send(user); // Send the user data as a JSON response
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.status(500).send('Error retrieving user');
    });
};

// update user
exports.updateUser =  (req, res) => {
  const { id } = req.body;
  const { username} = req.body;

  UserDB.findByIdAndUpdate(id, { username }, { new: true })
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

  UserDB.findByIdAndDelete(id)
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

// user login

exports.userLogin = async (req, res) => {
  // Process the login form submission
  const { username, password } = req.body;

    // Find the user by username
    const user = await UserDB.findOne({ username });

    if (!user) {
      res.redirect("/login");
      return;
    }

    if (password == user.password) {
      res.redirect("/userDashboard");
    } else {
      res.redirect("/login");
      return;
    }
  
};