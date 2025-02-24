require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get("/", (req,res) => {
    res.send("MFS API is Running...");
});

app.use("/api/auth", authRoutes);


app.listen(PORT,() => console.log(`MFS server is running on port ${PORT}`));