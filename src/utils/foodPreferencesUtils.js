const generateFoodPreferencesPrompt = (location) => {
  return `
    Based on the user's location (${location.city}, ${location.state}, ${location.country}), generate a list of food items categorized into the following JSON format strictly wrapped in ***:: and ::***:

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

    - Ensure the response uses the exact JSON format.
    - Include only valid food items based on local availability.
    - Avoid comments, extra text, or any unrelated content.
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

const extractWrappedJSONForFoodPreferences = (responseText) => {
  const match = responseText.match(/\*\*\*::(.*?)::\*\*\*/s);

  if (!match || !match[1]) {
    throw new Error("Wrapped JSON not found in response");
  }

  const extractedJSON = match[1].trim();

  try {
    const parsedJSON = JSON.parse(extractedJSON);

    if (!Array.isArray(parsedJSON)) {
      console.error("Extracted JSON is not a valid array:", parsedJSON);
      throw new Error("Unexpected JSON structure for food preferences.");
    }

    return parsedJSON;
  } catch (error) {
    console.error("Failed to parse JSON:", extractedJSON);
    throw new Error("Invalid JSON format.");
  }
};



// const match = responseText.match(/\*\*\*::(.*?)::\*\*\*/s);

//   if (!match || !match[1]) {
//     throw new Error("Wrapped JSON not found in response");
//   }

//   const extractedJSON = match[1].trim();

//   try {
//     const parsedJSON = JSON.parse(extractedJSON);

//     // Validate that it's an object structure
//     if (typeof parsedJSON !== "object" || Array.isArray(parsedJSON)) {
//       console.error("Extracted JSON is not a valid object:", parsedJSON);
//       throw new Error("Unexpected JSON structure for insights.");
//     }

//     return parsedJSON;
//   } catch (error) {
//     console.error("Failed to parse JSON:", extractedJSON);
//     throw new Error("Invalid JSON format.");
//   }
module.exports = {
  generateFoodPreferencesPrompt,
  retryRequest,
  extractWrappedJSONForFoodPreferences,
};
