const mongoose = require("mongoose");

const cheatMealSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, 
  name: { type: String, required: true },           
  imageUrl: { type: String, required: true },       
});

module.exports = mongoose.model("CheatMeal", cheatMealSchema);
