
const { generateInsightsPrompt } = require("../utils/insightsUtils");
const { extractWrappedJSON, retryRequest } = require("../utils/dietPlanUtils");
const User = require("../models/User");
const axios = require("axios");

  exports.generateInsights = async (req, res) => {
    const { userId } = req.body;
  
    try {
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
  
      console.log(`Fetching user data for insights generation (userId: ${userId})...`);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const prompt = generateInsightsPrompt(user);
  
      console.log("Generating insights...");
      const response = await retryRequest(() =>
        axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert in fitness and motivation.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 2048,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        )
      );
  
      const rawResponse = response.data.choices[0].message.content;
      const insightsData = extractWrappedJSON(rawResponse);
  
      console.log("Insights generated successfully:", insightsData);
      res.status(200).json(insightsData);
    } catch (error) {
      console.error("Error generating insights:", error.message);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  };