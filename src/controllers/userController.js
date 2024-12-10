const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id); 
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error in getUserById for ID: ${id}`, error.message);
    res.status(404).json({ message: error.message });
  }
};
