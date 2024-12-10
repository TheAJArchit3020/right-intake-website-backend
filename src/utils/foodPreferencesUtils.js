const generateFoodPreferencesPrompt = (location) => {
  return `
    Based on the user's location (${location.city}, ${location.state}, ${location.country}), generate a list of food items categorized as follows:
    1. Veggies (local and popular in the user's location)
    2. Carbs (local staples such as rice, bread, or chapati)
    3. Fruits and Berries (seasonal and regionally available)
    4. Meat (optional, include common meats like chicken, fish, mutton if applicable)

    Only return the lists in this format:
    Veggies: ["Cauliflower", "Bhindi", "Mushroom"]
    Carbs: ["Chapati", "Rice", "Bread"]
    FruitsAndBerries: ["Strawberries", "Papaya", "Watermelon"]
    Meat: ["Chicken", "Fish", "Mutton"]
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