const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { sendMassage, allMassage } = require("../controllers/messageController");
const messageRoutes = express.Router();

messageRoutes.route("/").post(protect, sendMassage);
messageRoutes.route("/:chatId").post(protect, allMassage);

module.exports = messageRoutes;
