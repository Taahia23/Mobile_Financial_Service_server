const express = require("express");
const { getBalance } = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/balance", authenticateUser, getBalance);

module.exports = router;
