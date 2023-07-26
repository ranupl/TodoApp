const bcrypt = require("bcrypt");
const { UserDB } = require("../../models/user");
const itemsPerPage = 5;
var totalPages;
var page;

// user CURD operation
// create and save new user
exports.createUser = async (req, res) => {
  // validate request
  const { username, email } = req.body;
  const user = await UserDB.find({
    $or: [{ email: email }, { username: username }],
  });

  if (user.length > 0) {
    const message = " Username or email already exists !";
    return res.render("signup", { message });
  }

  if (!req.body) {
    const message = " Content can not be empty !";
    res.render("signup", { message });
    return;
  }

  const { password } = req.body;
  let pass = password.toString();
  const hashedPassword = await bcrypt.hash(pass, 10);

  // new user
  const newUser = new UserDB({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
    status: "active",
    privilege: "user",
  });

  // save user in the database
  newUser
    .save()
    .then((data) => {
      const username = data.username;
      const privilege = data.privilege;
      const currentDate = new Date();
      var lastlogin = currentDate.toLocaleTimeString();
      // session
      req.session;
      req.session.username = username;
      req.session.privilege = privilege;
      req.session.lastlogin = lastlogin;

      if (req.session.username) {
        res.redirect("/userDashboard");
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating a create operation",
      });
    });
};

// get all users
exports.getAllUsers = async (req, res) => {
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.cookies.privilege;

  // pagging

  if (role == "admin") {
    page = parseInt(req.query.page) || 1;

    try {
      const totalItems = await UserDB.countDocuments({});
      totalPages = Math.ceil(totalItems / itemsPerPage);

      const users = await UserDB.find({})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();

      res.render("users", { users, page, totalPages, uname, lastlogin });
    } catch (err) {
      res.status(500).send("Error retrieving items");
    }
  }

  UserDB.find()
    .then((users) => {
      res.render("users", { users, uname, lastlogin });
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users");
    });
};

// get user by id
exports.getUserByID = (req, res) => {
  const userId = req.params.id;
  UserDB.findById(userId)
    .then((user) => {
      res.render("editUserUserModel", { user });
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
  const adminUser = req.session.username;
  UserDB.find()
    .then((users) => {
      res.render("allTodos", { users, adminUser,limit:"" });
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users");
    });
};

// user login
exports.userLogin = async (req, res) => {
  const { text, password } = req.body;

  // Find the user by username
  const user = await UserDB.find({
    $or: [{ email: text }, { username: text }],
  });

  // console.log(user[0].password);
  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  // console.log(isPasswordValid);

  if (user.length == 0) {
    res.render("login", { message: " User not found !" });
    return;
  } else {
    if (isPasswordValid) {
      user[0].privilege = "user";

      const username = user[0].username;
      const privilege = user[0].privilege;
      const currentDate = new Date();
      var lastlogin = currentDate.toLocaleTimeString();

      // session
      req.session;
      req.session.username = username;
      req.session.privilege = privilege;
      req.session.lastlogin = lastlogin;
      res.cookie("privilege", privilege);

      if (req.session.username) {
        res.redirect("/userDashboard");
      } else {
        res.redirect("/login");
      }
    } else {
      const message = " Invalid username or password ! ";
      res.render("login", { message });
      return;
    }
  }
};

// Search route
exports.searching = (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;

  UserDB.find({ firstname: { $regex: searchText, $options: "i" } })
    .then((users) => {
      res.render("users", { users, uname, lastlogin, totalPages, page });
    })
    .catch((err) => console.error("Error searching in MongoDB:", err));
};

// limited data
exports.limitUserData = async (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.session.privilege;
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();
  const limit = req.body.limit;

  try {
    const users = await UserDB.find().limit(limit);
    res.render("users", {
      totalPages,
      page,
      uname,
      adminUser,
      lastlogin,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
