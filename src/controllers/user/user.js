const bcrypt = require("bcrypt");
const { UserDB } = require("../../models/user");
const { Cookie } = require("express-session");
const { mailSend } = require("../../utils/mail");

const itemsPerPage = 5;
var totalPages;
var page;

// user CURD operation
// create and save new user
exports.createUser = async (req, res) => {
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

  const currentDate = new Date();
  var lastlogedin = currentDate.toLocaleTimeString();

  // new user
  const newUser = new UserDB({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
    status: "active",
    privilege: "user",
    lastlogin: lastlogedin,
  });

  // save user in the database
  newUser
    .save()
    .then((data) => {
      const username = data.username;
      const privilege = data.privilege;
      const lastlogin = data.lastlogin;

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

  // pagging + getAllusers
  if (role == "admin") {
    page = parseInt(req.query.page) || 1;

    try {
      const totalItems = await UserDB.countDocuments({});
      totalPages = Math.ceil(totalItems / itemsPerPage);

      const users = await UserDB.find({})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();

      res.render("users", {
        users,
        page,
        totalPages,
        uname,
        lastlogin,
        limit: itemsPerPage,
      });
    } catch (err) {
      res.status(500).send("Error retrieving items");
    }
  }

  UserDB.find()
    .then((users) => {
      res.render("users", {
        users,
        uname,
        lastlogin,
        limit: itemsPerPage,
        totalPages,
        page,
      });
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
      res.render("editUserModel", { user });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error retrieving user");
    });
};

// update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);

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
      res.render("allTodos", { users, adminUser, limit: itemsPerPage });
    })
    .catch((error) => {
      res.status(500).send("Error retrieving users");
    });
};

// user login
exports.userLogin = async (req, res) => {
  var isPasswordValid;
  const { unameEmail, password } = req.body;

  const user = await UserDB.find({
    $or: [{ email: unameEmail }, { username: unameEmail }],
  });

  if (user.length == 0) {
    res.render("login", { message: " User not found !" });
    return;
  }

  if (user.length > 0) {
    
    isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (isPasswordValid) {
      user[0].privilege = "user";
      const username = user[0].username;
      const privilege = user[0].privilege;
      const lastlogin = user[0].lastlogin;

      // session
      req.session;
      req.session.username = username;
      req.session.privilege = privilege;
      req.session.lastlogin = lastlogin;

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      
      try {
        await UserDB.updateOne(
          { email: unameEmail },
          { $set: { lastlogin: formattedDate } },
        );
        if (req.session.username) {
          res.redirect("/userDashboard");
        } else {
          res.redirect("/login");
        }
      } catch (error) {
        // Error occurred during update
        console.error("Error during update:", error);
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
      res.render("users", {
        users,
        uname,
        lastlogin,
        totalPages,
        page,
        limit: "",
      });
    })
    .catch((err) => console.error("Error searching in MongoDB:", err));
};

// limit data
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
      limit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

// user password reset by email varification
exports.emailForm = async (req, res) => {
  const {email} = req.body;
  const user = await UserDB.find({ email }).lean().exec();
  const userData = user[0];
  
  if (userData != undefined) {
    let min = 1000;
    let max = 5000;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    let html = `<pre>Otp ${otp}</pre>`;
    await  mailSend("Forgot password otp",email,`Hello ${userData.name}`,html);
    await UserDB.updateOne(
      { email },
      { $set: { otp: `${otp}` } }
    );
    // res.cookie("otp", otp);
    res.status(200).json({status:200,status:"success",message:"Otp sent on mail."});

  } else {
    const message = "Invalid email address";
    res.status(200).json({status:200,status:"failed",message:message});
    // console.log("aukdfhk");
  }
};

// otp validation
exports.otpForm = async (req, res) => {
  const {otp,email} = req.body;
  const user = await UserDB.find({ email }).lean().exec();
  const userData = user[0];

  if (otp == userData.otp) {
    res.status(200).json({status:200,status:"success",message:"Otp Verified successfully"});
  } else {
    res.status(200).json({status:200,status:"failed",message:"Invalid Otp"});
  }
};

// user passwordEdit
exports.passwordEdit = async (req, res, next) => {
  const { password, confirmPassword,email } = req.body;

  try {
    if (password !== confirmPassword) {
      return  res.status(200).json({status:200,status:"failed",message:"password and confirmation password not matched"});
    }
    const user = await UserDB.find({ email }).lean().then();

    if (!user) {
      return  res.status(200).json({status:200,status:"failed",message:"User not found!"});
    }
    const hashpass = await bcrypt.hash(password, 10);

    const result = await UserDB.updateOne(
      { email },
      { $set: { password: hashpass } }
    );

    if (result.modifiedCount > 0) {
      return  res.status(200).json({status:200,status:"success",message:"Password updated succesfully"});
    } else {
      const message = "Something went wrong while changing password !";
      return  res.status(200).json({status:200,status:"failed",message:message});
    }
  } catch (err) {
    console.log(err);
  }
};
