const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { name, mobile, email, nid, pin, accountType } = req.body;

        if (!name || !mobile || !email || !nid || !pin || !accountType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }, { nid: nid }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPin = await bcrypt.hash(String(pin), 10);

        const user = new User({
            name,
            mobile,
            email,
            nid,
            pin: hashedPin,
            accountType,
            balance: accountType === "Agent" ? 100000 : 40,
        });

        console.log("Saving user:", user);
        await user.save();

        res.status(201).json({ message: "User is registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, pin } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log("Stored Hashed PIN:", user.pin);
        console.log("Entered PIN:", pin);

        const isMatch = await bcrypt.compare(pin.trim(), user.pin);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid PIN" });
        }

        res.status(200).json({ message: "Login successful", token: "fake-jwt-token" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};




module.exports = {registerUser, loginUser};


