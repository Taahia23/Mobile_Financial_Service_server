const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        senderId : {type: mongoose.Schema.Types.ObjectId, ref: "User", required : true},
        receiverId : {type : mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        amount : {type:Number, required : true},
        type: {type:String, enum : ["Send Money", "Cash-in", "Cash_out"], required:true},
        transactionFee: { type: Number , default:0},
        transactionId : {type:String,  unique: true, required:true}
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;