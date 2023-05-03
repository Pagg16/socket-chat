const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRouters = require("./routes/userRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("./middlewares/cors");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use(cors);

const PORT = process.env.PORT || 5000;

app.use("/user", userRouters);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log("Server started on port " + PORT));
