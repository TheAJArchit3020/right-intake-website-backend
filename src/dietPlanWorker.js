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
const DietPlan = require("./models/dietPlans");
const connectDB = require("./config/db");
const dietPlanQueue = require("./services/RedisandBullQueue");
const pdfQueue = require("./services/pdfBullQueue");

const CONCURRENCY = 5; // Number of concurrent jobs to process
const DELAY_BETWEEN_BATCHES = 3000; // Delay in milliseconds

connectDB()
  .then(() => {
    console.log("Worker MongoDB connected");
  })
  .catch((error) => {
    console.error("Worker MongoDB connection error:", error);
  });

dietPlanQueue.process(CONCURRENCY, async (job, done) => {
  try {
    console.log(`Processing diet plan job for userId: ${job.data.userId}`);
    const { userId } = job.data;

    if (!userId) throw new Error("Missing userId in job data");

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const totalDays = 1; // Total days for the diet plan
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays);

    const dietPlanChunks = [];
    const systemPrompt = generateSystemPrompt();

    // Generate diet plan
    for (let daysOffset = 0; daysOffset < totalDays; daysOffset++) {
      const day1Date = new Date(startDate);
      day1Date.setDate(startDate.getDate() + daysOffset);

      const weekdaysFull = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const day1MealType = user.nonVegDays.includes(
        weekdaysFull[day1Date.getDay()]
      )
        ? "Non-Veg"
        : "Veg";

      console.log(`Generating prompt for Day ${day1Date.toDateString()}`);
      const prompt = generateDietPlanPrompt(user, day1Date, day1MealType);

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
      } catch (error) {
        console.error(
          `Failed to generate diet plan for Day ${day1Date.toDateString()}:`,
          error.message
        );
        throw error;
      }
    }

    // Save diet plan to database
    const dietPlan = new DietPlan({
      userId,
      startDate,
      endDate,
      days: dietPlanChunks,
    });
    await dietPlan.save();
    console.log(`Diet plan saved successfully for userId: ${userId}`);

    // Add PDF generation job to the queue
    console.log(`Adding PDF generation job to pdfQueue for userId: ${userId}`);
    await pdfQueue.add({ userId });

    done(null, { success: true });
  } catch (error) {
    console.error("Diet plan job failed:", error.message);
    done(error);
  }
});

// Add delay between batches
dietPlanQueue.on("completed", async (job) => {
  console.log(`Job completed for userId: ${job.data.userId}`);
  const activeJobs = await dietPlanQueue.getActive();
  if (activeJobs.length === 0) {
    console.log("Batch of jobs completed. Waiting 3 seconds before next batch...");
    await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
  }
});
