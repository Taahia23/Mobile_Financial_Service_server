const User = require("../models/User");

const getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBalance };
