const { AdminDB } = require("../../models/admin");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./todoStorage');

// adming login
exports.adminLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;
  // console.log(text);

  // Find the user by username
  const user = await AdminDB.find({
    $or: [{ email: text }, { username: text }],
  });

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  if (password == user[0].password) {
    let currentUser = user[0]._doc;
    currentUser.role="admin";
    console.log(currentUser);
  
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    res.redirect("/adminDashboard");
  } else {
    // res.redirect("/admin");
    res.status(400).json({ message: "Invalid username or email" });
    return;
  }
};

// admin update
exports.adminUpdate = async (req, res) => {
  const { password, newpassword, confirmpassword } = req.body;

  // Find the user by username
  const admin = await AdminDB.findOne({ password });
 
  if (admin.password == password) {
    AdminDB.updateOne({password : password}, { $set: { password: newpassword } }).then();
    if (newpassword == confirmpassword) {
      res.redirect("/adminDashboard");
    } else {
      res.send(400).json({ message: "Invalid password" });
    }
  } else {
    res.render("admin", { error: "Invalid email" });
  }
};
