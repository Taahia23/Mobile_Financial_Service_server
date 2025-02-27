require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: "http://taahia-mfs.surge.sh",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://taahia-mfs.surge.sh");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.sendStatus(204);
});

app.use(express.json());
app.use(cookieParser());


app.get("/", (req,res) => {
    res.send("MFS API is Running...");
});

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/user", userRoutes);

app.listen(PORT,() => console.log(`MFS server is running on port ${PORT}`));