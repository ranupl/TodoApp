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
  const { unameEmail, password } = req.body;
  
  const user = await AdminDB.find({
    $or: [{ email: unameEmail }, { username: unameEmail }],
  });
 
  const userData = user[0];

  if (userData == undefined) {
    res.render("admin", { message: "User not found " });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, userData.password);

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
  const {email} = req.body;
  const user = await AdminDB.find({ email }).lean().exec();
  const userData = user[0];
  
  if (userData != undefined) {
    let min = 1000;
    let max = 5000;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    let html = `<pre>Otp ${otp}</pre>`;
    await  mailSend("Forgot password otp",email,`Hello ${userData.name}`,html);
    await AdminDB.updateOne(
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
exports.adminOtpForm = async (req, res) => {
  const {otp,email} = req.body;
  const user = await AdminDB.find({ email }).lean().exec();
  const userData = user[0];

  if (otp == userData.otp) {
    res.status(200).json({status:200,status:"success",message:"Otp Verified successfully"});
  } else {
    res.status(200).json({status:200,status:"failed",message:"Invalid Otp"});
  }
};

// user passwordEdit
exports.adminPasswordEdit = async (req, res, next) => {
  const { password, confirmPassword,email } = req.body;
  try {
    if (password !== confirmPassword) {
      return  res.status(200).json({status:200,status:"failed",message:"password and confirmation password not matched"});
    }
    const user = await AdminDB.find({ email }).lean().then();

    if (!user) {
      return  res.status(200).json({status:200,status:"failed",message:"User not found!"});
    }
    const hashpass = await bcrypt.hash(password, 10);

    const result = await AdminDB.updateOne(
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
