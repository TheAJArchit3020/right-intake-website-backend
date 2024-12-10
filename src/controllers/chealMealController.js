const { getAllCheatMeals } = require("../services/cheatMeal");

exports.getCheatMeals = async (req, res) => {
  try {
    const cheatMeals = await getAllCheatMeals();
    res.status(200).json(cheatMeals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cheat meals", error: error.message });
  }
};
