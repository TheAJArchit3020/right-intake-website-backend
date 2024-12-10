const generateDietPlanPrompt = (user, daysOffset) => {
  const cheatMeals = user.cheatMeals.length ? user.cheatMeals.join(", ") : "None";
  const nonVegDays = user.nonVegDays.length ? user.nonVegDays.join(", ") : "None";
  const workoutEquipment =
    user.homeWorkoutEquipment.length > 0
      ? user.homeWorkoutEquipment.join(", ")
      : "No equipment";

  return `Create a detailed, customized diet and workout plan for days ${
    daysOffset + 1
  } to ${daysOffset + 10} for a user based on the following details:
      - Full Name: ${user.fullName}
      - Age: ${user.age} years
      - Gender: ${user.gender}
      - Height: ${user.height} cm
      - Weight: ${user.weight} kg
      - Activity Level: ${user.activityLevel}
      - Known Health Conditions: ${
        user.healthConditions.length ? user.healthConditions.join(", ") : "None"
      }
      - Allergies: ${user.allergies.length ? user.allergies.join(", ") : "None"}
      - Location: ${user.city}, ${user.state}, ${user.country}
      - Diet Type: ${user.dietType}
      - Non-Veg Days: ${nonVegDays}
      - Selected Food Preferences: ${
        user.foodPreferences.length ? user.foodPreferences.join(", ") : "None"
      }
      - Food Avoidances: ${
        user.foodAvoidances.length ? user.foodAvoidances.join(", ") : "None"
      }
      - Frequency of Meals: ${user.mealFrequency || "3"} per day
      - Primary Goal: ${user.primaryGoal}
      - Target Weight: ${user.targetWeight || "Not specified"} kg
      - Goal Timeline: ${user.targetTimeline || "Not specified"}
      - Average Sleep Hours: ${user.sleepHours || "Not specified"} hours per night
      - Daily Water Intake: ${user.waterIntake || "Not specified"} liters
      - Cheat Meals: ${cheatMeals}
      - Workout Preference: ${user.workoutPreference}
      - Home Workout Equipment: ${workoutEquipment}
      - Weekly Training Days: ${user.weeklyTrainingDays}

      Each day must include:
      - A detailed diet plan with breakfast, lunch, and dinner. Each meal should include:
          - Food items (name, quantity, calories, macronutrients: protein, carbs, and fats)
          - Total calories for the meal
      - Cheat Meal: Suggest one cheat meal for each day if applicable.
      - A workout plan, including:
          - Warm-up exercises (name, sets, reps)
          - Main workout exercises (name, sets, reps, tailored to the user's preference: ${
            user.workoutPreference
          })
          - Stretching exercises (name, duration in minutes, or sets/reps)

      Ensure the response is valid JSON and does not include any comments, placeholders, or unnecessary text. Return the JSON wrapped in ***:: and ::***, like this:
  
      ***:: {
          "days": [
              {
                  "day": 1,
                  "meals": {
                      "breakfast": { "items": [...], "totalCalories": 300 },
                      "lunch": { "items": [...], "totalCalories": 500 },
                      "dinner": { "items": [...], "totalCalories": 400 },
                      "cheatMeal": "Pizza Slice"
                  },
                  "workout": {
                      "warmUp": [...],
                      "mainWorkout": [...],
                      "stretching": [...]
                  }
              },
              ...
          ]
      } ::***
  `;
};


const generateSystemPrompt = () => {
  return `You are an expert nutritionist and fitness trainer. Generate a detailed 30-day diet and workout plan for a user based on the following details:

  **User Information**:
  - Full Name: Full name of the user.
  - Age: User's age in years (e.g., 25).
  - Gender: Their gender (e.g., Male, Female).
  - Height: User's height in cm (e.g., 175).
  - Weight: User's weight in kg (e.g., 70).
  - Body Type: One of ectomorph, mesomorph, or endomorph.
  - Activity Level: Sedentary, lightly active, moderately active, very active, or super active.
  - Known Health Conditions: E.g., diabetes, hypertension.
  - Allergies: List of allergies.
  - Location: City, state, and country.

  **Dietary Information**:
  - Diet Type: Vegetarian, non-vegetarian, or both.
  - Non-Veg Days: Specify which days the user prefers non-vegetarian food (e.g., Monday, Wednesday).
  - Selected Food Preferences: List of preferred food items.
  - Food Avoidances: List of items to avoid.
  - Frequency of Meals: Number of meals per day (e.g., 3 meals/day).
  - Cheat Meals: Specify the days and types of cheat meals.

  **Fitness Goals**:
  - Primary Goal: Weight loss, muscle gain, or maintenance.
  - Target Weight: Goal weight in kg (optional).
  - Goal Timeline: The desired time frame to achieve the goal.
  - Workout Preference: Gym, home workout, or outdoors.
  - Home Workout Equipment: Specify the equipment available for home workouts (e.g., resistance bands, kettlebell, or no equipment).
  - Weekly Training Days: Number of days the user trains per week (e.g., 2-3 days, 4-5 days, or 6 days a week).

  **Lifestyle Information**:
  - Average Sleep Hours: Number of hours the user sleeps per night.
  - Daily Water Intake: Amount of water the user drinks per day (in liters).

  **Output Requirements**:
  For each day, provide:
  - **Meals**: Breakfast, lunch, dinner, and snacks (if applicable), with:
      - Food items (name, quantity, calories, macronutrients: protein, carbs, fats)
      - Total calories for each meal and for the day
  - **Workout Plan**:
      - Warm-up Exercises: Include exercise names, sets, and reps.
      - Main Workout: Tailored to the user's workout preference and available equipment, with sets, reps, or duration.
      - Stretching: Include exercises with duration or sets/reps.

  Return the result as valid JSON wrapped in ***:: and ::***.`;
};
const extractWrappedJSON = (responseText) => {
  const match = responseText.match(/\*\*\*::(.*?)::\*\*\*/s);
  if (match && match[1]) {
    return JSON.parse(match[1].trim());
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
  