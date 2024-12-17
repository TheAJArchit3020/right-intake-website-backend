const CheatMeal = require("../models/CheatMeal");
const cheatMealsData = require("../data/cheatMeals.json");

const seedCheatMeals = async () => {
  try {
    for (const meal of cheatMealsData) {
      await CheatMeal.updateOne(
        { id: meal.id }, 
        { $set: meal },  
        { upsert: true } 
      );
    }

    const idsToKeep = cheatMealsData.map((meal) => meal.id);
    await CheatMeal.deleteMany({ id: { $nin: idsToKeep } });

    console.log("Cheat meals have been synchronized with the database successfully");
  } catch (error) {
    console.error("Error seeding/updating/removing cheat meals:", error.message);
  }
};

module.exports = seedCheatMeals;
