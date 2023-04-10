const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default: "../images/default-picture.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async (next) => {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(20);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
