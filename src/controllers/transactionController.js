// Send Money
const sendMoney = async (req, res) => {
    try {
        const { receiverMobile, amount } = req.body;
        const senderId = req.user.id;

        if (amount < 50) return res.status(400).json({ message: "Minimum amount is 50 taka" });

        const sender = await User.findById(senderId);
        const receiver = await User.findOne({ mobile: receiverMobile });

        if (!receiver) return res.status(400).json({ message: "Receiver not found" });

        let transactionFee = 0;
        if (amount > 100) transactionFee = 5;

        if (sender.balance < amount + transactionFee) return res.status(400).json({ message: "Insufficient balance" });

        sender.balance -= amount + transactionFee;
        receiver.balance += amount;

        const admin = await User.findOne({ accountType: "Admin" });
        if (admin) admin.balance += 5;

        const transaction = new Transaction({
            senderId: sender._id,
            receiverId: receiver._id,
            amount,
            type: "Send Money",
            transactionFee,
            transactionId: uuidv4(),
        });

        await sender.save();
        await receiver.save();
        if (admin) await admin.save();
        await transaction.save();

        res.json({ message: "Transaction successful", transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Cash-In (User to Agent)
const cashIn = async (req, res) => {
    try {
        const { agentMobile, amount } = req.body;
        const agent = await User.findOne({ mobile: agentMobile, accountType: "Agent" });

        if (!agent) return res.status(400).json({ message: "Agent not found" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ message: "User not found" });

        user.balance += amount;

        // Save transaction
        const transaction = new Transaction({
            senderId: agent._id,
            receiverId: user._id,
            amount,
            type: "Cash-In",
            transactionFee: 0,
            transactionId: uuidv4(),
        });

        await user.save();
        await transaction.save();

        res.json({ message: "Cash-in successful", transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};