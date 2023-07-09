const express = require("express");
const router = express.Router();
const userCon = require("../controllers/user/user");


router.get("/signup", userCon.createUser);
   


module.exports = router;