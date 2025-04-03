const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String, // hashed using bcrypt
});

module.exports = mongoose.model("Admin", AdminSchema);
