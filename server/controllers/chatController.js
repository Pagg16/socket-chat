const asyncHandler = require("express-async-handler");
const Chat = require("../scheme/chatSchema");
const User = require("../scheme/userschema");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastedMessage");

  isChat = await User.populate(isChat, {
    path: "lastedMessage.sender",
    select: "name image email",
  });

  if (isChat) {
    return res.send(isChat);
  }

  try {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findOne({ _id: createdChat.id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(fullChat);
  } catch (e) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastedMessage")
      .sort({
        updatedAt: -1,
      })
      .then(async (rersult) => {
        rersult = await User.populate(rersult, {
          path: "lastedMessage.sender",
          select: "name image email",
        });

        res.status(200).send(rersult);
      });
  } catch (e) {
    res.status(200);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  console.log(1);

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to from a group chat");
  }

  try {
    const chatGroup = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    await chatGroup.save();

    const fullGroupChat = await Chat.findOne({
      _id: isGroupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (e) {
    res.status(200);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updateChat);
  }
});

const groupRemove = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { user: userId },
    },
    { nre: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const groupAdd = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { user: userId },
    },
    { nre: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  groupRemove,
  groupAdd,
};
