const express = require("express");
const router = express.Router();
const { handleGenerateNewShortURL } = require("../controllers/url");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, handleGenerateNewShortURL);

module.exports = router;
