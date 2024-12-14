const generateDietPlanPrompt = (user, daysOffset) => {
  const cheatMeals = user.cheatMeals.length ? user.cheatMeals.join(", ") : "None";
  const nonVegDays = user.nonVegDays.length ? user.nonVegDays.join(", ") : "None";
  const workoutEquipment = user.homeWorkoutEquipment || "No equipment";
  const foodPreferences = user.foodPreferences.length
    ? user.foodPreferences
        .map((pref) => `${pref.category}: ${pref.items.join(", ")}`)
        .join("; ")
    : "None";

  const includeTip = user.primaryGoal === "weight loss" || user.primaryGoal === "get shredded";

  return `Create a detailed, customized diet and workout plan for days ${
    daysOffset + 1
  } to ${daysOffset + 2} for a user based on the following details:
        - Full Name: ${user.fullName}
        - Age: ${user.age} years
        - Gender: ${user.gender}
        - Height: ${user.height} cm
        - Weight: ${user.weight} kg
        - Body Fat Percentage: ${user.bodyFatPercentage || "Not specified"}
        - Activity Level: ${user.activityLevel || "Not specified"}
        - Known Health Conditions: ${
          user.healthConditions.length ? user.healthConditions.join(", ") : "None"
        }
        - Allergies: ${user.allergies || "None"}
        - Location: ${user.city}, ${user.state}, ${user.country}
        - Diet Type: ${user.dietType}
        - Non-Veg Days: ${nonVegDays}
        - Selected Food Preferences: ${foodPreferences}
        - Frequency of Meals: ${user.mealFrequency || "3"} per day
        - Primary Goal: ${user.primaryGoal}
        - Target Weight: ${user.targetWeight || "Not specified"} kg
        - Average Sleep Hours: ${user.sleepHours || "Not specified"} hours per night
        - Daily Water Intake: ${user.waterIntake || "Not specified"} liters
        - Cheat Meals: ${cheatMeals}
        - Workout Preference: ${user.workoutPreference}
        - Home Workout Equipment: ${workoutEquipment}
        - Weekly Training Days: ${user.weeklyTrainingDays}

        Each day must include:
        - **Meals**: Breakfast, lunch, snacks, and dinner (all meals are mandatory). 
          If a meal is skipped or not required, explicitly include it with an empty "items" array and "totalCalories" set to 0.
        - A detailed diet plan with the following meals:
            - **Breakfast**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Lunch**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Snacks**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - **Dinner**: Food items (name, quantity, calories, and macronutrients: protein, carbs, fats)
            - Total calories for each meal
        - **Total calories for the day as totalDayCalories**
        - A workout plan including:
            - Exercise name
            - Sets
            - Reps, or duration in seconds if the exercise requires holding a position (e.g., Plank or Wall Sit)
        - ${
          includeTip
            ? "**Tip of the Day**: Include one motivational or fitness tip in a single sentence (e.g., 'Drink plenty of water to stay hydrated and improve performance.')."
            : ""
        }

        Ensure the response is valid JSON and does not include any comments, placeholders, or unnecessary text. Return the JSON wrapped in ***:: and ::***, using the following schema:

        ***:: {
            "days": [
                {
                    "day": 1,
                    "meals": {
                        "breakfast": { "items": [], "totalCalories": 0 },
                        "lunch": { "items": [], "totalCalories": 0 },
                        "snacks": { "items": [], "totalCalories": 0 },
                        "dinner": { "items": [], "totalCalories": 0 }
                    },
                    "totalDayCalories": 0,
                    "workout": [
                        { "name": "", "sets": 0, "reps": "" }
                    ],
                    ${
                      includeTip
                        ? `"tip": "Include a motivational or actionable fitness tip for the day in one sentence."`
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
      - Food items (name, quantity, calories, macronutrients: protein, carbs, fats)
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
      return JSON.parse(match[1].trim());
    } catch (error) {
      console.error("Invalid JSON in response:", match[1]);
      throw new Error("Failed to parse JSON");
    }
  }
  throw new Error("Failed to extract JSON from response");
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
