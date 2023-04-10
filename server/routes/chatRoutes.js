const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  groupRemove,
  groupAdd,
} = require("../controllers/chatController");
const chatRoutes = express.Router();

chatRoutes.route("/").post(protect, accessChat);
chatRoutes.route("/").get(protect, fetchChats);
chatRoutes.route("/group").post(protect, createGroupChat);
chatRoutes.route("/rename").put(protect, renameGroup);
chatRoutes.route("/groupremove").put(protect, groupRemove);
chatRoutes.route("/groupadd").put(protect, groupAdd);

module.exports = chatRoutes;
