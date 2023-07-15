const { AdminDB } = require("../../models/admin");

// admin dashboard
exports.adminDashboard = async (req, res) => {
  const userCookie = req.cookies.currentUser;
  const id = userCookie[0]._id;
  // console.log(id);

  AdminDB.findById(id)
  .then((user) => {
    res.render("adminDashboard", { user });
  })
  .catch((error) => {
    // Handle the error
    console.error(error);
    res.status(500).send("Error retrieving user");
  });
}



// adming login
exports.adminLogin = async (req, res) => {
  // Process the login form submission
  const { text, password } = req.body;

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
    currentUser.privilege = "admin";
   
    res.cookie('currentUser', user, {maxAge: 900000});
    res.redirect("/adminDashboard");
    // res.render("/adminDashboard", {user});
  } else {
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
