const { getBmiCategory } = require("../services/bmiService");

exports.calculateBmi = async (req, res) => {
  const { bmi } = req.body;

  try {
    if (typeof bmi !== "number" || bmi <= 0) {
      return res.status(400).json({ message: "BMI value is required and must be a positive number" });
    }

    const response = getBmiCategory(bmi);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error calculating BMI category:", error.message);
    res.status(500).json({ message: "Failed to calculate BMI category", error: error.message });
  }
};
