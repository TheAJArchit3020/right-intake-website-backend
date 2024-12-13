const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const mockUser = {
  fullName: "John Doe",
  primaryGoal: "Weight loss",
};

const generateDietPlanPDF = async (dietPlan) => {
  const browser = await puppeteer.launch();
  const day = dietPlan.days[0];

  const logoPath = path.resolve(__dirname, "rightIntakeLogo.png");
  const logoBase64 = fs.readFileSync(logoPath, "base64");

  const generateHTML = () => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Montserrat:wght@400;700&display=swap">
    <style>
      body {
        font-family: 'Montserrat', sans-serif;
        margin: 0;
        padding: 15px;
        line-height: 1.4;
      }
      .header {
        text-align: center;
        margin-bottom: 15px;
      }
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .logo img {
        max-width: 35px;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        margin-top: 5px;
      }
      .quote {
        font-family: 'Dancing Script', cursive;
        font-size: 14px;
        margin-top: 3px;
        color: #555;
      }
      h1 {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }
      .meal-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .meal-details {
        width: 55%;
      }
      .meal-details strong {
        font-size: 16px;
      }
      .meal-summary {
        width: 40%;
        text-align: left;
        font-size: 12px;
      }
      .meal-summary div {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .meal-summary div:first-child {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .meal-summary strong {
        font-weight: bold;
      }
      .highlight {
        margin-top: 15px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
      }
      .workout-section {
        margin-top: 15px;
        text-align: center;
      }
      .workout-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }
      .workout-table th, .workout-table td {
        border: 1px solid #ddd;
        padding: 5px;
        text-align: center;
        font-size: 12px;
      }
      .workout-table th {
        background-color: #f4f4f4;
        font-weight: bold;
      }
      .tips {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        color: #555;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding: 5px 15px;
        font-size: 10px;
        color: #555;
        border-top: 1px solid #ddd;
      }
      .footer-left {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .footer-left img {
        width: 25px;
        height: auto;
      }
      .footer-right a {
        color: #000;
        text-decoration: none;
      }
      .footer-right a:hover {
        text-decoration: underline;
      }
    </style>
    <title>Diet Plan</title>
  </head>
  <body>
    <!-- Header Section -->
    <div class="header">
      <div class="logo">
        <img src="data:image/png;base64,${logoBase64}" alt="Right Intake Logo">
        <span>Right intake</span>
      </div>
      <div class="title">Your 30-Day Personalized Diet and Workout Plan</div>
      <div class="quote">"Healthy Eating Starts Here!"</div>
    </div>
    
    <h1>Day ${day.day}/30</h1>
    
    ${["breakfast", "lunch", "snacks", "dinner"].map(mealType => {
      const meal = day.meals[mealType];
      const mealTitle = {
        breakfast: "Breakfast Boost",
        lunch: "Lunchtime Delight",
        snacks: "Power Snack",
        dinner: "Twilight Meal",
      }[mealType];

      return `
        <div class="meal-section">
          <div class="meal-details">
            <strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
            <ul>
              ${meal.items.map(item => `
                <li>${item.name} (${item.quantity}): ${item.calories} kcal</li>
              `).join("")}
            </ul>
          </div>
          <div class="meal-summary">
            <div>
              <strong>Total calories of ${mealTitle}</strong>
              <span>${meal.totalCalories} kcal</span>
            </div>
            <div class="macros">
              <strong>Macros</strong>: Protein ${meal.items.reduce((sum, item) => sum + item.macronutrients.protein, 0)}g, 
              Carbs ${meal.items.reduce((sum, item) => sum + item.macronutrients.carbs, 0)}g, 
              Fats ${meal.items.reduce((sum, item) => sum + item.macronutrients.fats, 0)}g
            </div>
          </div>
        </div>
      `;
    }).join("")}
    
    <div class="highlight">
      Today's Tip: "Take a 10-15 minute walk after lunch – it aids digestion, boosts energy, and keeps you refreshed for the rest of the day."
    </div>
    <div class="highlight">
      Total calories of day ${day.day}: ${day.totalDayCalories} kcal
    </div>
    
    <div class="workout-section">
      <h2>Workout for today</h2>
      <table class="workout-table">
        <thead>
          <tr>
            <th>Workout name</th>
            <th>Sets</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>
          ${day.workout.map(exercise => `
            <tr>
              <td>${exercise.name}</td>
              <td>${exercise.sets}</td>
              <td>${exercise.reps}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    
    <div class="tips">
      “Make sure to take rest time of 2 to 4 mins in between each workout”<br>
      “Do cardio for 40 mins as a post workout session for effective calorie burn”
    </div>
    <div class="congratulations" style="text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0;">
      Congratulations on Completing Your 30-Days Plan
    </div>
    
    <!-- Footer Section -->
    <div class="footer">
      <div class="footer-left">
        <img src="data:image/png;base64,${logoBase64}" alt="Right Intake Logo">
        <span>Right intake</span>
      </div>
      <div class="footer-right">
        <span>Send your valuable feedback on: <a href="mailto:contact@rightintake.com">contact@rightintake.com</a></span>
      </div>
    </div>
  </body>
  </html>
`;



  try {
    const page = await browser.newPage();
    await page.setContent(generateHTML(), { waitUntil: "networkidle0" });

    const pdfPath = path.resolve(__dirname, "Day1-DietPlan.pdf");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    console.log(`PDF successfully saved to ${pdfPath}`);
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    await browser.close();
  }
};

const sampleJSON = {
  days: [
    {
      day: 1,
      meals: {
        breakfast: {
          items: [
            { name: "Oatmeal", quantity: "1 cup", calories: 150, macronutrients: { protein: 5, carbs: 27, fats: 3 } },
            { name: "Spinach Smoothie", quantity: "1 cup", calories: 50, macronutrients: { protein: 2, carbs: 10, fats: 0 } },
          ],
          totalCalories: 200,
        },
        lunch: {
          items: [
            { name: "Bhindi Sabzi", quantity: "1 cup", calories: 100, macronutrients: { protein: 3, carbs: 20, fats: 4 } },
            { name: "Chapati", quantity: "1 medium", calories: 100, macronutrients: { protein: 3, carbs: 20, fats: 2 } },
          ],
          totalCalories: 200,
        },
        snacks: {
          items: [
            { name: "Carrot Sticks", quantity: "1 medium", calories: 25, macronutrients: { protein: 1, carbs: 6, fats: 0 } },
            { name: "Cucumber Slices", quantity: "1 medium", calories: 16, macronutrients: { protein: 1, carbs: 4, fats: 0 } },
          ],
          totalCalories: 41,
        },
        dinner: {
          items: [
            { name: "Cauliflower Rice", quantity: "1 cup", calories: 25, macronutrients: { protein: 2, carbs: 5, fats: 0 } },
            { name: "Brinjal Curry", quantity: "1 cup", calories: 120, macronutrients: { protein: 3, carbs: 18, fats: 6 } },
          ],
          totalCalories: 145,
        },
      },
      workout: [
        { name: "Bodyweight Squats", sets: 3, reps: "15" },
        { name: "Push-ups", sets: 3, reps: "10" },
        { name: "Plank", sets: 3, reps: "30 seconds" },
      ],
      totalDayCalories: 586,
    },
  ],
};

// Generate PDF
generateDietPlanPDF(sampleJSON);
