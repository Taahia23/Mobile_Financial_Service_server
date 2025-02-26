const express = require("express");
const { sendMoney, cashIn, cashOut } = require("../controllers/transactionController");
const authenticateUser = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send-money", authenticateUser, sendMoney);
router.post("/cash-in", authenticateUser, cashIn);
router.post("/cash-out", authenticateUser, cashOut);

module.exports = router;
