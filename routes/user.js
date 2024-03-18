const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/user");

// Signup route
router.post("/signup", signup);

// Signin route
router.post("/signin", signin);

module.exports = router;
