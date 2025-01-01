const express = require("express");
const router = express.Router();
const dietPlanController = require("../controllers/dietPlanController");
const cheatMeal = require("../controllers/chealMealController");
const { generateInsights } = require("../controllers/insightController");

router.post("/initiate-payment", dietPlanController.initiatePayment);
router.post("/verify-payment", dietPlanController.verifyPayment);
router.post("/save-temp" ,dietPlanController.saveTemporaryUserData)
router.post("/generate-food-preferences", dietPlanController.generateFoodPreferences);
router.get("/cheat-meal", cheatMeal.getCheatMeals);
router.post("/generate" ,dietPlanController.generateDietPlanDirectWithTempUser)

router.post("/generate-insights", generateInsights);

module.exports = router;
