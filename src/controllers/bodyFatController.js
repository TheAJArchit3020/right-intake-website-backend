const { getBodyFatInsight } = require("../services/bodyFatInsights");

exports.getBodyFatInsights = async (req, res) => {
  const { bodyFatPercentage } = req.body;

  try {
    if (typeof bodyFatPercentage !== "number" || bodyFatPercentage < 0 || bodyFatPercentage > 100) {
      return res.status(400).json({ message: "Invalid body fat percentage" });
    }

    const insights = getBodyFatInsight(bodyFatPercentage);
    res.status(200).json(insights);
  } catch (error) {
    console.error("Error fetching body fat insights:", error.message);
    res.status(500).json({ message: "Failed to fetch body fat insights" });
  }
};
