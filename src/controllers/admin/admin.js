const { AdminDB } = require("../../models/admin");

// adming login
exports.adminLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;
  // console.log(text);

  // Find the user by username
  const user = await AdminDB.find({
    $or: [{ email: text }, { username: text }],
  });
  // console.log(user[0].password);

  if (!user) {
    // res.redirect("/admin");
    res.status(400).json({message: "User not found"});
    
    return;
  }
  if (password == user[0].password) {
    res.redirect("/adminDashboard");
  } else {
      // res.redirect("/admin");
    res.status(400).json({message: "Invalid username or email"});
    return;
  }
};

// admin update
exports.adminUpdate = async (req, res) => {
  const { email, username, password, newpassword, confirmpassword } = req.body;

  // Find the user by username
  const admin = await AdminDB.findOne({ username });

  if (admin.email == email) {
    AdminDB.findByIdAndUpdate(admin.id, { $set: { password: newpassword } });
    res.redirect("/adminDashboard");
  } else {
    res.render("admin", { error: "Invalid email" });
  }
};
