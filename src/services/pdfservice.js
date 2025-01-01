const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const logoPath = path.resolve(__dirname, "rightIntakeLogo.png");
const logoBase64 = fs.readFileSync(logoPath, "base64");

const generateDietPlanPDF = async (dietPlan) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process", 
      "--disable-gpu",
    ],
  });

  const generateHTML = (day, dayNumber, isFirstPage) => `
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
        position: relative;
      }
      ${isFirstPage ? `
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
      ` : ''}
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
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 15px;
        font-size: 10px;
        color: #555;
        border-top: 1px solid #ddd;
        background: #fff;
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
    ${isFirstPage ? `
      <div class="header">
        <div class="logo">
          <img src="data:image/png;base64,${logoBase64}" alt="Right Intake Logo">
          <span>Right intake</span>
        </div>
        <div class="title">Your 30-Day Personalized Diet and Workout Plan</div>
        <div class="quote">"Healthy Eating Starts Here!"</div>
      </div>
    ` : ""}
    <h1>Day ${dayNumber}/30</h1>
    ${Object.entries(day.meals).map(([mealType, meal]) => `
      <div class="meal-section">
        <div class="meal-details">
          <strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
          <ul>
            ${meal.items.map(item => `
              <li>${item.name} (${item.quantity}): ${item.calories ?? "N/A"} kcal</li>
            `).join("")}
          </ul>
        </div>
        <div class="meal-summary">
          <div>
            <strong>Total calories</strong>: ${meal.totalCalories ?? "N/A"} kcal
          </div>
          <div>
            <strong>Macros</strong>: Protein ${meal.items.reduce((sum, item) => sum + (item.macronutrients?.protein || 0), 0)}g, 
            Carbs ${meal.items.reduce((sum, item) => sum + (item.macronutrients?.carbs || 0), 0)}g, 
            Fats ${meal.items.reduce((sum, item) => sum + (item.macronutrients?.fats || 0), 0)}g
          </div>
        </div>
      </div>
    `).join("")}
    <div class="highlight">
      Total calories of day ${dayNumber}: ${day.totalDayCalories ?? "N/A"} kcal
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
    ${day.tip ? `<strong>Tip of the Day:</strong> "${day.tip}"` : ""}
  </div>
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

    const pagesContent = dietPlan.days.map((day, index) =>
      generateHTML(day, index + 1, index === 0)
    ).join('<div style="page-break-after: always;"></div>');

    await page.setContent(pagesContent, { waitUntil: "networkidle0", timeout: 60000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("PDF generated in-memory");
    return pdfBuffer; 
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    await browser.close();
  }
};

module.exports = { generateDietPlanPDF };
