const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  groupRemove,
  groupAdd,
  findChat,
} = require("../controllers/chatController");
const { validateRequest } = require("../validation/validateRequest");
const {
  chatUpdateNameValidations,
  chatRemoveUserValidations,
  findChatValidations,
} = require("../validation/chatValidations");
const chatRoutes = express.Router();

chatRoutes.route("/").post(protect, accessChat);
chatRoutes.route("/").get(protect, fetchChats);
chatRoutes.route("/group").post(protect, createGroupChat);
chatRoutes
  .route("/findGroup")
  .get(validateRequest(findChatValidations), protect, findChat);
chatRoutes
  .route("/rename")
  .put(validateRequest(chatUpdateNameValidations), protect, renameGroup);
chatRoutes
  .route("/groupremove")
  .put(validateRequest(chatRemoveUserValidations), protect, groupRemove);
chatRoutes
  .route("/groupadd")
  .put(validateRequest(chatRemoveUserValidations), protect, groupAdd);

module.exports = chatRoutes;
