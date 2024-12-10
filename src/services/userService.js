const User = require("../models/User");


exports.getAllUsers = async () => {
  try {
    const users = await User.find(); 
    return users;
  } catch (error) {
    throw new Error("Failed to fetch all users");
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id); 
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user by ID");
  }
};
