const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("api start");
});

app.get("/chat", () => {});

app.get("/chat/:id", () => {
  const singleChat = chats.find((c) => c._id === res.params.id);
  res.send(singleChat);
});

app.listen(PORT, console.log("Server started on port " + PORT));
