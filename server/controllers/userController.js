const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../scheme/userschema");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pictureLink } = req.body;

  if (!name || !email || !password) {
    res.status(400);
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
  }

  const user = await User.create({
    name,
    email,
    password,
    pictureLink,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pictureLink,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(400);
  }
});

module.exports = { registerUser, authUser };
