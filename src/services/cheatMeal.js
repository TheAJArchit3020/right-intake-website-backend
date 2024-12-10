const CheatMeal = require("../models/CheatMeal");

exports.getAllCheatMeals = async () => {
  const cheatMeals = await CheatMeal.find();
  return cheatMeals;
};
