const bmiRanges = [
    {
        range: [0, 18.5],
        status: "Underweight",
        message: "You are underweight. Consider a balanced diet and consulting a health professional.",
        additionalInfo: {
          motivationalText: "Achieving a healthy weight is essential for better energy and well-being.",
        },
      },
      {
        range: [18.5, 24.9],
        status: "Normal",
        message: "You maintain a normal BMI, reflecting a healthy balance between weight and height.",
        additionalInfo: {
          motivationalText: "Keeping a normal BMI shows your dedication to staying healthy—Well Done!",
        },
      },
      {
        range: [25, 29.9],
        status: "Overweight",
        message: "You are overweight. A healthy diet and regular exercise are recommended.",
        additionalInfo: {
          motivationalText: "Taking small steps every day can lead to significant health improvements.",
        },
      },
      {
        range: [30, Infinity],
        status: "Obese",
        message: "You are in the obese range. Professional guidance is recommended to improve your health.",
        additionalInfo: {
          motivationalText: "Every journey starts with a single step—take action today for a healthier future.",
        },
      },
  ];
  
  const getBmiCategory = (bmi) => {
    for (const { range, status, message, additionalInfo } of bmiRanges)
    {
      if (bmi >= range[0] && bmi <= range[1]) {
        return { bmi, status, message, additionalInfo };
      }
    }
    throw new Error("Invalid BMI value");
  };
  
  module.exports = {
    getBmiCategory,
  };