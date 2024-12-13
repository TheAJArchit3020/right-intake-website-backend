const generateFoodPreferencesPrompt = (location) => {
  return `
    Based on the user's location (${location.city}, ${location.state}, ${location.country}), generate a list of food items categorized into the following JSON format wrapped in ***:: and ::***:

    ***:: [
      {
        "category": "Veggies",
        "items": ["Cauliflower", "Bhindi", "Mushroom"]
      },
      {
        "category": "Carbs",
        "items": ["Chapati", "Rice", "Bread"]
      },
      {
        "category": "FruitsAndBerries",
        "items": ["Strawberries", "Papaya", "Watermelon"]
      },
      {
        "category": "Meat",
        "items": ["Chicken", "Fish", "Mutton"]
      }
    ] ::***

    Include only food items that are local, popular, and regionally available in the user's location. Ensure the response is valid JSON and avoid any comments or additional text.
  `;
};


const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};


  module.exports = {
    generateFoodPreferencesPrompt,
    retryRequest,
  };