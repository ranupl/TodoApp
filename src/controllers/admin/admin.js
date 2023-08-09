const { AdminDB } = require("../../models/admin");
const bcrypt = require("bcrypt");

// admin dashboard
exports.adminDashboard = async (req, res) => {
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;

  AdminDB.find({ username: uname })
    .then((user) => {
      res.render("adminDashboard", { user, uname, lastlogin });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error retrieving user");
    });
};

// adming login
exports.adminLogin = async (req, res) => {
  var isPasswordValid;
  const { unameEmail, password } = req.body;

  const user = await AdminDB.find({
    $or: [{ email: unameEmail }, { username: unameEmail }],
  });
  const userData = user[0];

  if (userData == undefined) {
    res.render("admin", { message: "User not found " });
    return;
  }
 
  if (userData != undefined) {
    isPasswordValid = await bcrypt.compare(password, user[0].password);
   
    if (isPasswordValid) {
      user[0].privilege = "admin";
      const username = user[0].username;
      const privilege = user[0].privilege;

      const currentDate = new Date();
      var lastlogin = currentDate.toLocaleTimeString();

      // session
      session = req.session;
      req.session.username = username;
      req.session.privilege = privilege;
      req.session.lastlogin = lastlogin;

      if (req.session.username) {
        res.redirect("/adminDashboard");
        return;
      } else {
        res.redirect("/admin");
        return;
      }
    } else {
      const message = " Invalid username or password !";
      res.render("admin", { message });
      return;
    }
  }
};

// admin update
exports.adminUpdate = async (req, res) => {
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;

  const { password, newpassword, confirmpassword } = req.body;

  try {
    const user = await AdminDB.find({ username: uname }).lean().then();

    if (!user) {
      const message = "User not found!";
      return res.redirect("adminDashboard");
    }

    if (newpassword !== confirmpassword) {
      const message = "Passwords do not match!";
      return res.redirect("/adminDashboard");
    }

    const hashpass = await bcrypt.hash(newpassword, 10);

    const result = await AdminDB.updateOne(
      { username: uname },
      { $set: { password: hashpass } }
    );

    if (result.modifiedCount > 0) {
      const message = "Password Successfully Changed";
      res.redirect("/adminDashboard");
    } else {
      const message = "Something went wrong while changing password !";
      res.render("adminDashboard", { message, uname, lastlogin, user });
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

// user password reset by email varification
exports.adminEmailForm = async (req, res) => {
  const email = req.body.email;
  res.cookie("email", email);
  console.log(email);

  try {
    const user = await AdminDB.find({ email }).lean().exec();
    // const userData = user[0];
    console.log(user);
    if (userData != undefined) {
      var min = 1000;
      var max = 5000;
      const otp = Math.floor(Math.random() * (max - min + 1)) + min;
      res.cookie("otp", otp, { maxAge: 300000 , httpOnly: true});
      res.redirect("/login");
    } else {
      const message = "Invalid email address";
      res.render("admin", { message });
      console.log("invalid email");
    }
  } catch (err) {
    console.log(err);
  }
};

// otp validation
exports.adminOtpForm = (req, res) => {
  const userOtp = req.body.otp;
  const mainOtp = req.cookies.otp;

  if (userOtp == mainOtp) {
    const message = "Otp verified";
    return;
  } else {
    const message = "Invalid Otp";
    res.render("admin", { message });
  }
};

// user change password
exports.adminPasswordEdit = async (req, res, next) => {
  const email = req.cookies.email;
  const { password, confimPassword } = req.body;

  try {
    const user = await AdminDB.find({ email }).lean().then();

    if (!user) {
      const message = "User not found!";
      return res.render("admin", { message });
    }

    if (password !== confimPassword) {
      const message = "Passwords do not match!";
      return res.render("admin", { message });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const result = await AdminDB.updateOne(
      { email },
      { $set: { password: hashpass } }
    );

    if (result.modifiedCount > 0) {
      const message = "Password Successfully Changed";
      return;
    } else {
      const message = "Something went wrong while changing password !";
      res.render("admin", { message });
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
