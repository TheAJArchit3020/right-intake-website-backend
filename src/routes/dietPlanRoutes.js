const express = require("express");
const router = express.Router();
const dietPlanController = require("../controllers/dietPlanController");
const cheatMeal = require("../controllers/chealMealController");
const bmi = require("../controllers/bmiController")
const bodyFatController = require("../controllers/bodyFatController");
const { generateInsights } = require("../controllers/insightController");

router.post("/save-user", dietPlanController.saveUserData);
router.post("/initiate-payment", dietPlanController.initiatePayment);
router.post("/verify-payment", dietPlanController.verifyPayment);
router.post("/save-user-preferences", dietPlanController.saveUserPreferences);
router.post("/generate-food-preferences", dietPlanController.generateFoodPreferences);
router.get("/cheat-meal", cheatMeal.getCheatMeals);
router.post("/calculate-bmi", bmi.calculateBmi);

router.post("/body-fat-insights", bodyFatController.getBodyFatInsights);

router.post("/generate-insights", generateInsights);
module.exports = router;
