const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Identification
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  age: { type: Number, required: true },
  mobileNumber: { type: String, unique: true, required: true }, // used as the ID

  // Physical Attributes
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bodyFatPercentage: { 
    type: Number, 
    min: 0, 
    max: 100, 
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
  homeWorkoutEquipment: {
    type: [String], 
    default: [],
  },
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
  allergies: { type: [String], default: [] },

  // Location
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },

  // Dietary Preferences
  dietType: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],
    required: true,
  },

  cheatMeals: {
    type: [String], 
    default: [],
  },
  mealFrequency: { type: String, required: true },
  foodPreferences: { type: [String], default: [] },
  foodAvoidances: { type: [String], default: [] },

  occupation: { type: String, required: true },

  // Fitness Goals
  primaryGoal: { type: String, required: true },
  targetWeight: { type: Number },
  targetTimeline: { type: String },

  // Current Routine
  sleepHours: { type: Number },
  waterIntake: { type: Number },

  currentDietPlan: { type: mongoose.Schema.Types.ObjectId, ref: "DietPlan" },

  deleted: {
    type: Boolean,
    default: false,
  },
});


module.exports = mongoose.model("User", userSchema);
