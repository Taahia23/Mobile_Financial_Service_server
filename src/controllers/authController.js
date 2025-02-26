const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { name, mobile, email, nid, pin, accountType } = req.body;

        if (!name || !mobile || !email || !nid || !pin || !accountType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { mobile }, { nid }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("PIN before saving:", pin);

        const user = new User({
            name,
            mobile,
            email,
            nid,
            pin,
            accountType,
            balance: accountType === "Agent" ? 100000 : 40,
        });

        console.log("✅ Saving user:", user);
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

        console.log("Received Email:", email); 
        console.log("Received PIN:", pin);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found!");
            return res.status(400).json({ message: "User not found" });
        }

        console.log("Stored Hashed PIN from DB:", user.pin); 
        console.log("Comparing with:", pin.toString().trim()); 

        const isMatch = await bcrypt.compare(pin.toString().trim(), user.pin);

        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid PIN" });
        }

        const token = jwt.sign(
            { id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {registerUser, loginUser};


