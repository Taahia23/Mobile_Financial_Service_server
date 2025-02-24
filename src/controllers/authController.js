const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const {name, mobile, email, nid, pin, accountType} = req.body;


        if(!name || !mobile || !email || !nid || !pin || !accountType) {
            return res.status(400).json({message: "all fields are required"});
        }
        // Check if user already exists
        const existingUser = await User.findOne({$or : [{email}, {mobile}, {nid}]});
        if(existingUser) return res.status(400).json({message:"User already exists"});
        
        const hashedPin = await bcrypt.hash(pin, 10);
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

        res.status(201).json({message: "User is registered successfully"});
    
    }

    catch(error) {
        res.status(500).json({message: error.message});
    }
};

const loginUser = async (req,res) => {
    try{
        const{email,pin} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if(!isMatch){
            return res.status(400).json({message: "invalid pin provided"});
        }

        const token = jwt.sign({
            id: user._id,
            accountType: user.accountType
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    );
    res.cookie("token", token, {httpOnly:true}).json({message: "Login successful", token});

    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {registerUser, loginUser};


