const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB is connected successfully");
        console.log("Connected to DB:", mongoose.connection.name); 
    } 
    catch(error) {
        console.error("Database Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB