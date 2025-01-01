const Bull = require("bull");

const pdfQueue = new Bull("pdfQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

pdfQueue.on("error", (error) => {
  console.error("PDF Queue Redis Error:", error.message);
});

pdfQueue.on("failed", (job, err) => {
  console.error(
    `PDF job failed for userId: ${job.data.userId}, email: ${job.data.email}. Error:`,
    err.message
  );
});

console.log("Redis Queue connected for pdfQueue");

module.exports = pdfQueue;
