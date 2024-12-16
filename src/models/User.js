const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Identification
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  age: { type: Number, required: true },
  mobileNumber: { type: String, required: true }, // used as the ID

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
    required: true,
  },
  homeWorkoutEquipment: { type: [String], default: [] },
  weeklyTrainingDays: {
    type: String,
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
    required: true, 
  },

  cheatMeals: {
    type: [String], 
    default: [],
  },
  foodPreference: {
    type: Map,
    of: [String],
    default: {},
  },

  fitnessLevel: {
    type: String,
    default: "",
  },

  occupation: { type: String, required: true },

  // Fitness Goals
  primaryGoal: { type: String, required: true },
  targetWeight: { type: String },

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
