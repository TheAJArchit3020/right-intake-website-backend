const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const {
  generateDietPlanPrompt,
  generateSystemPrompt,
  extractWrappedJSON,
  retryRequest,
} = require("./utils/dietPlanUtils");
const axios = require("axios");
const User = require("./models/User");
const fs = require("fs");
const DietPlan = require("./models/dietPlans");
const connectDB = require("./config/db");
const dietPlanQueue = require("./services/RedisandBullQueue");
const pdfQueue = require("./services/pdfBullQueue");


connectDB()
  .then(() => {
    console.log("Worker MongoDB connected");
  })
  .catch((error) => {
    console.error("Worker MongoDB connection error:", error);
  });
  dietPlanQueue.process(25, async (job, done) => {
    try {
      console.log(`Processing diet plan job for userId: ${job.data.userId}`);
      const { userId } = job.data;
  
      if (!userId) throw new Error("Missing userId in job data");
  
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
  
      const totalDays = 1; 
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + totalDays);
  
      const dietPlanChunks = [];
      const systemPrompt = generateSystemPrompt();
  
      for (let daysOffset = 0; daysOffset < totalDays; daysOffset++) {
        let success = false;
        const day1Date = new Date(startDate);
        day1Date.setDate(startDate.getDate() + daysOffset);
      
        const weekdaysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day1MealType = user.nonVegDays.includes(weekdaysFull[day1Date.getDay()])
          ? "Non-Veg"
          : "Veg";
      
        console.log(`Day meal type: ${day1MealType}`);
        const prompt = generateDietPlanPrompt(user, day1Date, day1MealType);
      
        console.log(`Generating prompt for Day ${day1Date.toDateString()}`);
      
        while (!success) {
          try {
            const response = await retryRequest(() =>
              axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                  ],
                  max_tokens: 2500,
                  temperature: 0.5,
                },
                {
                  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
                }
              )
            );
      
            const rawResponse = response.data.choices[0].message.content;
            const chunk = extractWrappedJSON(rawResponse);
      
            const updatedDays = chunk.days.map((dayEntry, index) => ({
              ...dayEntry,
              day: index + 1, 
            }));
      
            dietPlanChunks.push(...updatedDays);
            success = true;
          } catch (error) {
            console.error(`Retry failed for Day ${day1Date.toDateString()}:`, error.message);
            console.log("Retrying...");
          }
        }
      }
      
      const dietPlan = new DietPlan({
        userId,
        startDate,
        endDate,
        days: dietPlanChunks,
      });
      await dietPlan.save();
      console.log(`Diet plan saved successfully for userId: ${userId}`);
  
      console.log(`Adding PDF generation job to pdfQueue for userId: ${userId}`);
      await pdfQueue.add({ userId });
  
      done(null, { success: true });
    } catch (error) {
      console.error("Diet plan job failed:", error.message);
      done(error);
    }
  });