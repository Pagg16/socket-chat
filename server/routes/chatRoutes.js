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

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, groupRemove);
router.route("/groupadd").put(protect, groupAdd);

module.exports = chatRoutes;
