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
  const { text, password } = req.body;

  // Find the user by username
  const user = await AdminDB.find({
    $or: [{ email: text }, { username: text }],
  });
   
  const isPasswordValid = await bcrypt.compare(password, user[0].password);
   
  if (user.length == 0) {
    res.render("admin", { message: "****** User not found ******" });
    return;
  } else {
    if (isPasswordValid) {
      user[0].privilege = "admin";
      const username = user[0].username;
      const privilege = user[0].privilege;
      // res.cookie("privilege", privilege);

      const currentDate = new Date();
      var lastlogin = currentDate.toLocaleTimeString();

      // session
      session = req.session;
      req.session.username = username;
      req.session.privilege = privilege;
      req.session.lastlogin = lastlogin;

      if (req.session.username) {
        res.redirect("/adminDashboard");
      } else {
        res.redirect("/admin");
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
  const uname = req.session.uname;
  const lastlogin = req.session.lastlogin;

  const { password, newpassword, confirmpassword } = req.body;

  let confimpass = confirmpassword.toString();
  const hashconfpass = await bcrypt.hash(confimpass, 10);

  let newpass = newpassword.toString();
  const hashnewpass = await bcrypt.hash(newpass, 10);

  let pass = password.toString();
  const hashedPassword = await bcrypt.hash(pass, 10);

  // Find the user by username
  const admin = await AdminDB.findOne({ uname });
  console.log(admin);
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  console.log(isPasswordValid);
  
  if (isPasswordValid) {
    AdminDB.updateOne(
      { password: hashedPassword },
      { $set: { password: hashnewpass } }
    ).then();

    if (hashnewpass == hashconfpass) {
      res.redirect("/adminDashboard");
    } else {
      res.send(400).json({ message: "Invalid password" });
    }
  } else {
    res.render("admin", { error: "Invalid email" });
  }
};
