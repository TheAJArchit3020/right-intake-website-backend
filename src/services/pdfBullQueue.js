const Bull = require("bull");

// Initialize PDF Generation Queue
const pdfQueue = new Bull("pdfQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Handle errors
pdfQueue.on("error", (error) => {
  console.error("PDF Queue Redis Error:", error.message);
});

// Handle failed jobs
pdfQueue.on("failed", (job, err) => {
  console.error(
    `PDF job failed for userId: ${job.data.userId}, email: ${job.data.email}. Error:`,
    err.message
  );
});

console.log("Redis Queue connected for pdfQueue");

// Export the queue
module.exports = pdfQueue;
