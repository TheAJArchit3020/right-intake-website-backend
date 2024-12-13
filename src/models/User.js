const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Identification
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  age: { type: Number, required: true },
  mobileNumber: { type: String, unique: true, required: true }, // used as the ID

  // Physical Attributes
  height: { type: String, required: true }, //change to string
  weight: { type: String, required: true }, //change to string
  bodyFatPercentage: { 
    type: String, // Changed to string
  },

  nonVegDays: {
    type: [String], 
    default: [], // Only applicable for non-vegetarian users
  },
  workoutPreference: {
    type: String,
    enum: ["gym", "home workout", "outdoors"],
    required: true,
  },
  homeWorkoutEquipment: { type: String, default: "" },
  weeklyTrainingDays: {
    type: String,
    enum: [
      "I haven't trained before",
      "2-3 days a week",
      "4-5 days a week",
      "6 days a week",
    ],
    required: true,
  },

  healthConditions: { type: [String], default: [] },
  allergies: { type: String, default: "" }, // only string

  // Location
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },

  // Dietary Preferences
  dietType: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true, 
  },

  cheatMeals: {
    type: [String], 
    default: [],
  },
  foodPreferences: {
    type: [
      {
        category: { type: String, required: true },
        items: { type: [String], default: [] }, // String array
      },
    ],
    default: [],
  }, //object {category, names}

  occupation: { type: String, required: true },

  // Fitness Goals
  primaryGoal: { type: String, required: true },
  targetWeight: { type: Number },

  // Current Routine
  sleepHours: { type: String }, // string
  waterIntake: { type: String }, // string

  currentDietPlan: { type: mongoose.Schema.Types.ObjectId, ref: "DietPlan" },

  deleted: {
    type: Boolean,
    default: false,
  },
});


module.exports = mongoose.model("User", userSchema);
