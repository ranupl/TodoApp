const { AdminDB } = require("../../models/admin");

// admin dashboard
exports.adminDashboard = async (req, res) => {
  const uname = req.cookies.username;

  AdminDB.find({ username: uname })
    .then((user) => {
      res.render("adminDashboard", { user });
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      res.status(500).send("Error retrieving user");
    });
};

// adming login
exports.adminLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;

  // Find the user by username
  const user = await AdminDB.find({
    $or: [{ email: text }, { username: text }],
  });

  if (user.length == 0) {
    res.render("admin", { message: "****** User not found ******" });
    return;
  } else {
    if (password == user[0].password) {
      user[0].privilege = "admin";
      const username = user[0].username;
      const privilege = user[0].privilege;
      const password = user[0].password;
      
      // session
      session = req.session;
      req.session.loggedIn = true;
     
      // cookie
      res.cookie("username", username);
      res.cookie("password", password);
      res.cookie("privilege", privilege);

      if(req.session.loggedIn)
      {
        res.redirect("/adminDashboard");
      }
      else
      {
        res.redirect("/admin");
      }
      
    } else {
      const message = "****** Invalid username or email ******";
      res.render("admin", { message });
      return;
    }
  }
};

// admin update
exports.adminUpdate = async (req, res) => {
  const { password, newpassword, confirmpassword } = req.body;

  // Find the user by username
  const admin = await AdminDB.findOne({ password });

  if (admin.password == password) {
    AdminDB.updateOne(
      { password: password },
      { $set: { password: newpassword } }
    ).then();

    if (newpassword == confirmpassword) {
      res.redirect("/adminDashboard");
    } else {
      res.send(400).json({ message: "Invalid password" });
    }
    
  } else {
    res.render("admin", { error: "Invalid email" });
  }
};
