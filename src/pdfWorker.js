const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const DietPlan = require("./models/dietPlans");
const User = require("./models/User"); 
const { generateDietPlanPDF } = require("./services/pdfservice")
const { sendDietPlanEmail, generateEmailContent } = require("./services/emailService"); 
const connectDB = require("./config/db");
const pdfQueue = require("./services/pdfBullQueue");


connectDB()
  .then(() => {
    console.log("PDF Queue Worker MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error in PDF Queue Worker:", error);
  });


pdfQueue.process(23, async (job, done) => {
  try {
    console.log(`Processing PDF generation job for userId: ${job.data.userId}`);
    const { userId } = job.data;

    if (!userId) throw new Error("Missing userId in job data");

    const dietPlan = await DietPlan.findOne({ userId });
    if (!dietPlan) throw new Error("Diet plan not found");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    console.log(`Generating PDF for userId: ${userId}`);

    const pdfBuffer = await generateDietPlanPDF(dietPlan);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF generation failed: Buffer is empty");
    }

    // console.log(`Sending diet plan email to ${user.email}`);

    // const emailContent = generateEmailContent();

    // await sendDietPlanEmail(user.email, "Your Customized Diet Plan", emailContent, pdfBuffer);

    // console.log(`Email sent successfully for userId: ${userId}`);
    done(null, { success: true });
  } catch (error) {
    console.error(`PDF job failed for userId: ${job.data.userId}. Error:`, error.message);
    done(error);
  }
});
