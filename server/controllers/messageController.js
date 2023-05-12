const asyncHandler = require("express-async-handler");
const Message = require("../scheme/messageSchema");
const User = require("../scheme/userschema");
const Chat = require("../scheme/chatSchema");

const sendMassage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    message = await message.populate("sender", "name _id");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "_id",
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastedMessage: message,
    });

    res.json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const allMassage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name _id")
      .populate("chat");

    res.json(messages);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $unset: { [`unreadMessages.${chatId}`]: 1 } }
    );
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});
module.exports = { sendMassage, allMassage };
