const Bull = require("bull");

const dietPlanQueue = new Bull("dietPlanQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

module.exports = dietPlanQueue;
