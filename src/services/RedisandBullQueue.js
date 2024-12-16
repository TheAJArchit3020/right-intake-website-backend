const Bull = require("bull");

const dietPlanQueue = new Bull("dietPlanQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

dietPlanQueue.on("error", (error) => {
  console.error("Diet Plan Queue Redis Error:", error.message);
});

dietPlanQueue.on("failed", (job, err) => {
  console.error(
    `Job failed for userId: ${job.data.userId}, email: ${job.data.email}. Error:`,
    err.message
  );
});
module.exports = dietPlanQueue;
