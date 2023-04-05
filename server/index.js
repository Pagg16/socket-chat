const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRouters = require("./routes/userRouter");
dotenv.config();

connectDB();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("api start");
});

app.use("/user", userRouters);

app.listen(PORT, console.log("Server started on port " + PORT));
