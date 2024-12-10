const generateInsightsPrompt = (user) => {
  return `You are a fitness and nutrition expert. Based on the user's data, calculate and generate personalized insights to highlight their current fitness status, future goals, and concise actionable points to motivate them to subscribe to the premium diet and fitness plan. Here's the user data:

    **User Information**:
    - Full Name: ${user.fullName}
    - Gender: ${user.gender}
    - Age: ${user.age} years
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Body Fat Percentage: ${user.bodyFatPercentage || "Not provided"}
    - Activity Level: ${user.activityLevel}
    - Primary Goal: ${user.primaryGoal} (Choose from "Lose Weight", "Gain Muscle", "Get Shredded")

    **Instructions**:
    - Assume the user's lean body mass is calculated as \( 100\% - \text{Body Fat Percentage} \).
    - Muscle mass is approximately 42.5% of the lean body mass.
    - For the projected values after 6 months:
        - **Lose Weight:** Reduce the body fat percentage by 5% (but not below 10%), and preserve or slightly increase muscle mass.
        - **Gain Muscle:** Increase the body fat percentage by 2% (but not above 30%), and prioritize muscle mass growth.
        - **Get Shredded:** Reduce the body fat percentage by 8% (but not below 6%), and preserve muscle mass.
    - Recalculate the muscle mass percentage based on the projected body fat percentage.
    - Provide the following:
        1. Current body fat percentage and calculated muscle mass.
        2. Projected body fat percentage and muscle mass after 6 months, considering the user's primary goal.
        3. Maintenance calories and daily water intake based on the user's activity level and weight.
        4. Three actionable points tailored to the user's primary goal.

    **Return the response in strict JSON format, wrapped in ***:: and ::***, as follows:

    ***:: {
      "currentStats": {
        "bodyFatPercentage": "${user.bodyFatPercentage}%",
        "muscleMass": "XX%"
      },
      "goalStats": {
        "bodyFatPercentage": "XX%",
        "muscleMass": "XX%"
      },
      "personalizedInsights": {
        "maintenanceCalories": "XXXX Kcal",
        "dailyWaterIntake": "XX liters"
      },
      "goalFocus": {
        "selectedGoal": "${user.primaryGoal}",
        "keyPoints": [
          "High-Protein Diet",
          "Caloric Deficit",
          "Focus on compound lifts",
          "Drink plenty of water"
        ]
      }
    } ::***
    `;
};

module.exports = {
  generateInsightsPrompt,
};
