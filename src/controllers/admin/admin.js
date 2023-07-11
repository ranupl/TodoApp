const { AdminDB } = require("../../models/admin");


exports.adminLogin = async (req, res) => {
  // Process the login form submission
  const { username, password } = req.body;

    // Find the user by username
    const admin = await AdminDB.findOne({ username });

    if (!admin) {
      res.render("admin", { error: "Username not found" });
      return;
    }

    if (password == admin.password) {
      res.redirect("/adminDashboard");
    } else {
      res.render("admin", { error: "Incorrect password or username" });
      return;
    }
  
};