const generateDietPlanPrompt = (user, daysOffset, mealTypes) => {
  const day1MealType = mealTypes;

  const cheatMeals = user.cheatMeals.length ? user.cheatMeals.join(", ") : "None";
  const workoutEquipment = user.homeWorkoutEquipment || "No equipment";
  const foodPreferences =
    user.foodPreference && typeof user.foodPreference === "object"
      ? Object.entries(user.foodPreference)
          .map(([category, items]) => {
            const formattedItems = Array.isArray(items) ? items.join(", ") : "None";
            return `${category}: ${formattedItems}`;
          })
          .join("; ")
      : "None";

  const includeTip = user.primaryGoal === "weight loss" || user.primaryGoal === "get shredded";

  return `Create a detailed, customized diet and workout plan for day ${
    daysOffset
  } based on the following details:
        - Full Name: ${user.fullName}
        - Age: ${user.age} years
        - Gender: ${user.gender}
        - Height: ${user.height} cm
        - Weight: ${user.weight} kg
        - Body Fat Percentage: ${user.bodyFatPercentage || "Not specified"}
        - Activity Level: ${user.activityLevel || "Not specified"}
        - Fitness Level: ${user.fitnessLevel || "Not specified"}
        - Known Health Conditions: ${
          user.healthConditions.length ? user.healthConditions.join(", ") : "None"
        }
        - Allergies: ${user.allergies || "None"}
        - Location: ${user.city}, ${user.state}, ${user.country}
        - Diet Type: ${user.dietType}
        - Meal Type for Day ${daysOffset}: ${day1MealType}
        - Selected Food Preferences: ${foodPreferences}
        - Frequency of Meals: ${user.mealFrequency || "3"} per day
        - Primary Goal: ${user.primaryGoal}
        - Target Weight: ${user.targetWeight || "Not specified"} kg
        - Average Sleep Hours: ${user.sleepHours || "Not specified"} hours per night
        - Daily Water Intake: ${user.waterIntake || "Not specified"} liters
        - Cheat Meals: ${cheatMeals} (strictly include the cheat meal only once during the entire 30-day plan, on a suitable day).
        - Workout Preference: ${user.workoutPreference}
        - Home Workout Equipment: ${workoutEquipment}
        - Weekly Training Days: ${user.weeklyTrainingDays}

        Each day must include:
        - **Meals**: Breakfast, lunch, snacks, and dinner (all meals are mandatory). 
          If a meal is skipped or not required, explicitly include it with an empty "items" array and "totalCalories" set to 0.
          - Ensure the cheat meal (${cheatMeals}) is included only once for the entire 30-day plan and not more than that.
        - A detailed diet plan with the following meals:
            - **Breakfast**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Lunch**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Snacks**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Dinner**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - Total calories for each meal
        - **Total calories for the day as totalDayCalories**
        - A workout plan including:
            - Progressive intensity (increasing difficulty each week).
            - Exercise name
            - Sets
            - Reps, or duration in seconds if the exercise requires holding a position (e.g., Plank or Wall Sit)
        - ${
          includeTip
            ? "**Tip of the Day**: Include one motivational or fitness tip in a single sentence (e.g., 'Drink plenty of water to stay hydrated and improve performance.')."
            : ""
        }

        Ensure the response is valid JSON wrapped in ***:: and ::***. 
        Use the following schema:

        ***:: {
          "days": [
              {
                  "day": ${daysOffset},
                  "meals": {
                      "breakfast": { "items": [], "totalCalories": 0 },
                      "lunch": { "items": [], "totalCalories": 0 },
                      "snacks": { "items": [], "totalCalories": 0 },
                      "dinner": { "items": [], "totalCalories": 0 }
                  },
                  "totalDayCalories": 0,
                  "workout": [
                      { "name": "", "sets": 0, "reps": "" }
                  ]${
                    includeTip
                      ? `,
                  "tip": "Include a motivational or actionable fitness tip for the day in one sentence."`
                      : ""
                  }
              }
          ]
        } ::***`;
};




const generateSystemPrompt = () => {
  return `You are an expert nutritionist and fitness trainer. Generate a detailed 30-day diet and workout plan for a user based on the following details:

  **User Information**:
  - Full Name: Full name of the user.
  - Age: User's age in years (e.g., 25).
  - Gender: Their gender (e.g., Male, Female).
  - Height: User's height in cm (e.g., 175).
  - Weight: User's weight in kg (e.g., 70).
  - Fitness Level: Beginner, intermediate, or advanced.
  - Body Fat Percentage: User's body fat percentage (optional).
  - Activity Level: Sedentary, lightly active, moderately active, very active, or super active.
  - Known Health Conditions: E.g., diabetes, hypertension.
  - Allergies: List of allergies.
  - Location: City, state, and country.

  **Dietary Information**:
  - Diet Type: Vegetarian or non-vegetarian.
  - Non-Veg Days: Specify which days the user prefers non-vegetarian food (e.g., Monday, Wednesday).
  - Selected Food Preferences: Include categories (e.g., Veggies: Spinach, Carrot; Fruits: Mango, Papaya).
  - Frequency of Meals: Number of meals per day (e.g., 3 meals/day).
  - Cheat Meals: Specify the days and types of cheat meals.

  **Fitness Goals**:
  - Primary Goal: Weight loss, muscle gain, or maintenance.
  - Target Weight: Goal weight in kg (optional).
  - Workout Preference: Gym, home workout, or outdoors.
  - Home Workout Equipment: Specify the available equipment (e.g., resistance bands, kettlebell, or no equipment).
  - Weekly Training Days: Number of days the user trains per week (e.g., 2-3 days, 4-5 days, or 6 days a week).

  **Lifestyle Information**:
  - Average Sleep Hours: Number of hours the user sleeps per night.
  - Daily Water Intake: Amount of water the user drinks per day (in liters).

  **Output Requirements**:
  For each day, provide:
  - **Meals**: Breakfast, lunch, snacks, and dinner, with:
      - Food items (name, quantity, calories, macronutrients: protein, carbs, fats) the food items should be more detailed and should include ingredients as text.
      - Total calories for each meal
  - **Workout**: A list of exercises, each including:
      - Exercise name (e.g., "Push-ups")
      - Sets (e.g., 3)
      - Reps (e.g., "12" or "30 seconds") depending on the type of exercise.

  Return the result as valid JSON wrapped in ***:: and ::***.`;
};


const extractWrappedJSON = (responseText) => {
  const match = responseText.match(/\*\*\*::(.*?)::\*\*\*/s);
  if (match && match[1]) {
    try {
      const parsedJSON = JSON.parse(match[1].trim());
      if (!parsedJSON.days) {
        console.error("Extracted JSON does not contain 'days':", parsedJSON);
        throw new Error("Missing 'days' in extracted JSON");
      }
      return parsedJSON;
    } catch (error) {
      console.error("Invalid JSON in response:", match[1]);
      throw new Error("Failed to parse JSON");
    }
  }
  console.error("Failed to extract JSON from response:", responseText);
  throw new Error("No JSON match found in response");
};

  const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        return response;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response data:", error.response.data);
        }
      }
    }
  };

  module.exports = {
    generateDietPlanPrompt,
    generateSystemPrompt,
    extractWrappedJSON,
    retryRequest,
  };
