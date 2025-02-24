const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        mobile: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        nid: {type: String, required: true, unique: true},
        pin: {type: String, required: true},
        accountType: {type: String,enum : ["User", "Agent"], required: true},
        balance: {type: Number, default: 0},
        isBlocked : {type:Boolean, default:false}
    },
    {
        timestamps : true
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("pin")) return next();
    this.pin = await bcrypt.hash(this.pin, 10);
    next();
});

const User = mongoose.model("User", userSchema, "MFS_collection")
module.exports = User;