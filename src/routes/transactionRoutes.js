const express = require("express");
const { sendMoney, cashIn, cashOut } = require("../controllers/transactionController");
const authenticateUser = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send-money", authenticateUser, sendMoney);


module.exports = router;
