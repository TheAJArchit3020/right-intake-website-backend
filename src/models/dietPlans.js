const mongoose = require('mongoose');

const DietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  startDate: Date,
  endDate: Date,
  days: [
    {
      day: Number,
      meals: {
        breakfast: {
          items: [
            { name: String, quantity: String, calories: Number, macronutrients: { protein: Number, carbs: Number, fats: Number } },
          ],
          totalCalories: Number,
        },
        lunch: {
          items: [
            { name: String, quantity: String, calories: Number, macronutrients: { protein: Number, carbs: Number, fats: Number } },
          ],
          totalCalories: Number,
        },
        snacks: {
          items: [
            { name: String, quantity: String, calories: Number, macronutrients: { protein: Number, carbs: Number, fats: Number } },
          ],
          totalCalories: Number,
        },
        dinner: {
          items: [
            { name: String, quantity: String, calories: Number, macronutrients: { protein: Number, carbs: Number, fats: Number } },
          ],
          totalCalories: Number,
        },
      },
      workout: [
        { name: String, sets: Number, reps: String },
      ],
      totalDayCalories: Number,
      tip: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model('DietPlan', DietPlanSchema);
