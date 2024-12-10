const { PDFDocument, rgb } = require("pdf-lib");

const generateDietPlanPDF = async (dietPlan, userData) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]); 

  const titleFontSize = 18;
  const sectionFontSize = 14;
  const textFontSize = 12;

  let y = 750; // Start from the top of the page

  // Add title
  page.drawText(`30-Day Diet Plan for ${userData.fullName}`, {
    x: 50,
    y,
    size: titleFontSize,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  // Add user details
  page.drawText(`Primary Goal: ${userData.primaryGoal}`, { x: 50, y, size: textFontSize });
  y -= 20;

  page.drawText(`Target Weight: ${userData.targetWeight || "Not specified"} kg`, {
    x: 50,
    y,
    size: textFontSize,
  });
  y -= 30;

  // Loop through days
  for (const day of dietPlan.days) {
    // Check if page needs to be added
    if (y < 100) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }

    // Add Day header
    page.drawText(`Day ${day.day}`, {
      x: 50,
      y,
      size: sectionFontSize,
      color: rgb(0.2, 0.6, 0.8),
    });

    y -= 20;

    // Add Meals
    for (const mealType of ["breakfast", "lunch", "dinner"]) {
      const meal = day.meals[mealType];

      if (meal) {
        page.drawText(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:`, {
          x: 50,
          y,
          size: textFontSize,
          color: rgb(0.2, 0.5, 0.5),
        });

        y -= 20;

        for (const item of meal.items) {
          const itemText = `- ${item.name} (${item.quantity}) [Calories: ${item.calories}, Protein: ${item.macronutrients.protein}g, Carbs: ${item.macronutrients.carbs}g, Fats: ${item.macronutrients.fats}g]`;

          page.drawText(itemText, {
            x: 70,
            y,
            size: textFontSize,
            color: rgb(0, 0, 0),
          });

          y -= 20;
          if (y < 100) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
          }
        }

        y -= 10;
      }
    }
    y -= 20;

    // Add Workout Plan
    const workout = day.workout;
    if (workout) {
      page.drawText("Workout Plan:", { x: 50, y, size: sectionFontSize, color: rgb(0.2, 0.6, 0.8) });
      y -= 20;

      // WarmUp
      if (Array.isArray(workout.warmUp) && workout.warmUp.length > 0) {
        page.drawText("WarmUp:", { x: 50, y, size: textFontSize, color: rgb(0.2, 0.5, 0.5) });
        y -= 20;

        workout.warmUp.forEach((exercise) => {
          const exerciseText = `- ${exercise.name}: ${exercise.sets || 0} sets x ${exercise.reps || 0} reps`;
          page.drawText(exerciseText, { x: 70, y, size: textFontSize, color: rgb(0, 0, 0) });
          y -= 20;
          if (y < 100) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
          }
        });
      } else {
        page.drawText("WarmUp: Not available", { x: 50, y, size: textFontSize, color: rgb(0.5, 0.2, 0.2) });
        y -= 20;
      }

      // Main Workout
      if (Array.isArray(workout.mainWorkout)) {
        page.drawText("Main Workout:", { x: 50, y, size: textFontSize, color: rgb(0.2, 0.5, 0.5) });
        y -= 20;

        workout.mainWorkout.forEach((exercise) => {
          const exerciseText = `- ${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`;
          page.drawText(exerciseText, { x: 70, y, size: textFontSize, color: rgb(0, 0, 0) });
          y -= 20;
          if (y < 100) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
          }
        });
      }

      // Stretching
      if (Array.isArray(workout.stretching)) {
        page.drawText("Stretching:", { x: 50, y, size: textFontSize, color: rgb(0.2, 0.5, 0.5) });
        y -= 20;

        workout.stretching.forEach((exercise) => {
          const exerciseText = `- ${exercise.name}`;
          page.drawText(exerciseText, { x: 70, y, size: textFontSize, color: rgb(0, 0, 0) });
          y -= 20;
          if (y < 100) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
          }
        });
      }

      y -= 20;
    }
  }

  // Save the PDF and return as bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

module.exports = { generateDietPlanPDF };