const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const dietPlanQueue = require("./services/RedisandBullQueue");
const {
  generateDietPlanPrompt,
  generateSystemPrompt,
  extractWrappedJSON,
  retryRequest,
} = require("./utils/dietPlanUtils");
const {
  sendDietPlanEmail,
  generateEmailContent,
} = require("./services/emailService");
const axios = require("axios");
const User = require("./models/User");
const fs = require("fs");
const { generateDietPlanPDF } = require("./services/pdfservice");
const DietPlan = require("./models/dietPlans");
const connectDB = require("./config/db");

connectDB()
  .then(() => {
    console.log("Worker MongoDB connected");
  })
  .catch((error) => {
    console.error("Worker MongoDB connection error:", error);
  });
dietPlanQueue.process(async (job, done) => {
  try {
    const { userId } = job.data;
    if (!userId) throw new Error("Missing userId in job data");

    console.log(`Fetching user data for userId: ${userId}`);
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const email = user.email;
    console.log(`Generating diet plan for userId: ${userId}, email: ${email}`);

    const totalDays = 4;
    const dietPlanChunks = [];

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays);

    const systemPrompt = generateSystemPrompt();

    for (let daysOffset = 0; daysOffset < totalDays; daysOffset += 2) {
      const prompt = generateDietPlanPrompt(user, daysOffset);
      console.log(
        `Generating prompt for days ${daysOffset + 1} to ${daysOffset + 2}...`
      );

      const response = await retryRequest(() =>
        axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            max_tokens: 5000,
            temperature: 0.4,
          },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          }
        )
      );

      const rawResponse = response.data.choices[0].message.content;
      const chunk = extractWrappedJSON(rawResponse);
      dietPlanChunks.push(...chunk.days);
    }

    const dietPlan = new DietPlan({
      userId,
      startDate,
      endDate,
      days: dietPlanChunks,
    });

    console.log("Saving diet plan...");
    await dietPlan.save();
    console.log("Diet plan saved successfully.");

    console.log("Generating PDF...");
    const pdfBuffer = await generateDietPlanPDF(dietPlan);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF generation failed: Buffer is empty");
    }

    console.log(`PDF buffer size: ${pdfBuffer.length} bytes`);

    console.log(`Sending email to ${email}...`);
    const htmlContent = generateEmailContent();

    await sendDietPlanEmail(
      email,
      "Your Customized Diet Plan",
      htmlContent,
      pdfBuffer
    );

    console.log("Email sent successfully.");
    done(null, { success: true });
  } catch (error) {
    console.error("Job processing failed:", error.message);
    done(error);
  }
});
