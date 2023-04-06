const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRouters = require("./routes/userRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

connectDB();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/user", userRouters);
app.use("/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log("Server started on port " + PORT));
