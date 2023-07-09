const express = require("express");
const router = express.Router();
const userCon = require("../controllers/user/userController");

// page renders
router.get("/signup", userCon.signup);
router.get("/", userCon.home);
router.get("/welcome", userCon.welcome);
router.get("/login", userCon.login);
router.get("/admin", userCon.admin);
router.get("/todo", userCon.todo);
router.get("/adminDashboard", userCon.adminDashboard);
router.get("/dashboard", userCon.userDashboard);

// all user
router.post("/users", userCon.createUser);
router.get("/users", userCon.getAllUsers);
router.put("/users/:id", userCon.updateUser);
router.delete("/users/:id", userCon.deleteUser);

module.exports = router;