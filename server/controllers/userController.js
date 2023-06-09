const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const { validationResult } = require("express-validator");
const User = require("../scheme/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const pictureFile = req.file;

  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }
  let userImage = null;

  if (!!pictureFile) {
    userImage = {
      data: pictureFile.buffer,
      contentType: pictureFile.mimetype,
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    name,
    email,
    password: hashedPassword,
    image: userImage,
  });

  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    token: generateToken(user._id),
  });
});

const authUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        unreadMessages: user.unreadMessages,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error(error);
      res.status(401).json("Invalid token");
    }
  } else {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        unreadMessages: user.unreadMessages,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json("User not found");
    }
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  });

  res.json(users);
});

const findUser = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const user = await User.findOne({ _id: userId }).select(
    "-password -unreadMessages"
  );

  if (!user) {
    throw new Error("User is not found");
  }

  res.json(user);
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const pictureFile = req.file;

  if (!pictureFile) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.image = {
    data: pictureFile.buffer,
    contentType: pictureFile.mimetype,
  };

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    token: generateToken(user._id),
  });
});

const updateUserName = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!!!name && !!!email) {
    res.status(400);
    throw new Error("Please write name or email");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!!name) {
    user.name = name;
  }

  if (!!email) {
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    token: generateToken(user._id),
  });
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUserAvatar,
  updateUserName,
  findUser,
};
