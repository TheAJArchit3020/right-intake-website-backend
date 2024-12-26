const mongoose = require('mongoose');


const temporaryUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true }, // Duplicate emails allowed
    mobileNumber: { type: String, required: true }, // Duplicate numbers allowed
    gender: { type: String, enum: ["Male", "Female"], required: true },
    age: { type: Number, required: true },
  
    // Physical Attributes
    height: { type: String, required: true },
    weight: { type: String, required: true },
    bodyFatPercentage: { type: String },
  
    nonVegDays: { type: [String], default: [] },
    workoutPreference: { type: String, required: true },
    homeWorkoutEquipment: { type: [String], default: [] },
    weeklyTrainingDays: { type: String, required: true },
  
    healthConditions: { type: [String], default: [] },
    allergies: { type: String, default: "" },
  
    // Location
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  
    // Dietary Preferences
    dietType: { type: String, required: true },
    cheatMeals: { type: [String], default: [] },
    foodPreference: { type: Map, of: [String], default: {} },
  
    fitnessLevel: { type: String, default: "" },
    occupation: { type: String, required: true },
  
    // Fitness Goals
    primaryGoal: { type: String, required: true },
    targetWeight: { type: String },
  
    // Current Routine
    sleepHours: { type: String },
    waterIntake: { type: String },
  
    // Payment and Tracking
    paymentStatus: { type: String, enum: ["PENDING", "SUCCESS"], default: "PENDING" },
    createdAt: { type: Date, default: Date.now, expires: "24h" },
  });
  
  
  module.exports = mongoose.model("TemporaryUser", temporaryUserSchema);
  