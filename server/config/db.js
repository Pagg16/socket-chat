const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongoose connected " + process.env.MONGO_URI))
    .catch((e) => console.log(e));
}

module.exports = connectDB;
