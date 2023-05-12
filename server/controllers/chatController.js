const asyncHandler = require("express-async-handler");
const Chat = require("../scheme/chatSchema");
const User = require("../scheme/userschema");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastedMessage");

  if (isChat) {
    isChat = await User.populate(isChat, {
      path: "lastedMessage.sender",
      select: "name _id",
    });
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
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "_id")
      .populate({
        path: "lastedMessage",
        populate: { path: "sender", select: "name _id" },
      })
      .sort({
        lastedMessage: -1,
      })
      .then((result) => {
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(200);
    throw new Error(error.message);
  }
});

const findChat = asyncHandler(async (req, res) => {
  const { chatId } = req.query;

  try {
    Chat.findOne({
      _id: chatId,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "_id")
      .populate("lastedMessage")
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
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  const users = await User.find({ _id: { $in: JSON.parse(req.body.users) } });

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
      _id: chatGroup._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "_id");

    res.status(200).json(fullGroupChat);
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
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
    .populate("groupAdmin", "_id");

  if (!updateChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updateChat);
  }
});

const groupRemove = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (
      !chat.groupAdmin.equals(req.user._id) &&
      userId !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Only group admin can remove users");
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "_id");

    const userIds = chat.users.map((user) => user._id.toString());

    if (userIds.length === 0) {
      await Chat.findByIdAndRemove(chatId);
    }

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  } catch (e) {
    console.log(e);
  }
});

const groupAdd = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "_id");

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
  findChat,
};
