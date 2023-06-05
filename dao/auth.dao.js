const userModel = require("../models/users.models");

exports.createUser = async (userData) => {
  const newUser = new userModel(userData);
  await newUser.save();
};

exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.updateResetToken = async (userId, token, expiration) => {
  await userModel.updateOne(
    { _id: userId },
    { resetToken: token, resetTokenExpires: expiration }
  );
};
