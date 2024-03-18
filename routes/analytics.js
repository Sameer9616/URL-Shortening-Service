const express = require("express");
const router = express.Router();
const { handleGetAnalytics } = require("../controllers/url");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:shortId", verifyToken, handleGetAnalytics);

module.exports = router;
