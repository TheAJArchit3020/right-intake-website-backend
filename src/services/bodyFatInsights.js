const bodyFatInsights = [
    {
      range: [0, 5],
      status: "Essential Fat",
      message: "Your body fat is at the essential level, crucial for normal body functions.",
      benefits: [
        "Improved metabolic functions",
        "Better joint and organ protection",
      ],
      motivation: "Maintain a healthy balance to avoid deficiencies.",
    },
    {
      range: [6, 14],
      status: "Athletes",
      message: "You have a body fat percentage typical of athletes.",
      benefits: [
        "Enhanced physical performance",
        "Improved muscle definition",
      ],
      motivation: "Keep up the hard work and dedication to your fitness!",
    },
    {
      range: [15, 19],
      status: "Fitness",
      message: "You're in fantastic shape—your dedication really shows!",
      benefits: [
        "Reduced risk of chronic diseases",
        "Balanced hormone levels",
      ],
      motivation: "You’re a little step away from reaching your goal. Push harder!",
    },
    {
      range: [20, 24],
      status: "Average",
      message: "You have an average body fat percentage, which is healthy for most people.",
      benefits: [
        "Good overall health",
        "Better energy levels",
      ],
      motivation: "Consider slight adjustments in diet and exercise for optimal health.",
    },
    {
      range: [25, Infinity],
      status: "Above Average",
      message: "Your body fat percentage is above average. It's time to take action.",
      benefits: [
        "Improved energy levels with fat reduction",
        "Reduced risk of lifestyle diseases",
      ],
      motivation: "Small, consistent steps lead to big results. Start today!",
    },
  ];
  
  const getBodyFatInsight = (bodyFatPercentage) => {
    for (const { range, status, message, benefits, motivation } of bodyFatInsights) {
      if (bodyFatPercentage >= range[0] && bodyFatPercentage <= range[1]) {
        return {
          status,
          message,
          benefits,
          motivation,
        };
      }
    }
    throw new Error("Invalid body fat percentage");
  };
  
  module.exports = { getBodyFatInsight };
  