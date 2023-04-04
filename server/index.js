const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("api start");
});

app.listen(5000, console.log("Server started"));
