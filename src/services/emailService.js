const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendDietPlanEmail = async (
  to,
  subject,
  htmlContent,
  pdfBuffer,
  pdfFileName = "diet-plan.pdf"
) => {
  const mailOptions = {
    from: `"Right Intake" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: pdfFileName,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};
const generateEmailContent = () => {
  return `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    h1 {
      color: #007BFF;
      text-align: center;
    }
    p {
      font-size: 16px;
      margin: 10px 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .btn {
      display: inline-block;
      background-color: #007BFF;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 10px;
    }
    .btn:hover {
      background-color: #0056b3;
    }
    .highlight {
      font-weight: bold;
      color: #007BFF;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Customized Diet Plan</h1>
    <p>Hello,</p>
    <p>Your personalized <span class="highlight">30-day diet plan</span> is ready! You can find the detailed plan attached as a PDF document.</p>
    <p>Stay committed, stay healthy, and achieve your goals!</p>
    <p>Best regards,<br><span class="highlight">The Right Intake Team</span></p>
    
    <h1>Register for the ₹15,000 Challenge</h1>
    <p><strong>Step 1:</strong> Take a photo holding a piece of paper with today’s date written on it. Email the photo to <a href="mailto:contact@rightintake.com" class="highlight">contact@rightintake.com</a> along with your name and email address to track your progress.</p>
    <p><strong>Step 2:</strong> After 30 days, take another photo holding a piece of paper with the current date. Send this photo to <a href="mailto:contact@rightintake.com" class="highlight">contact@rightintake.com</a>.</p>
    <p>We will review all submissions carefully, and the participant demonstrating the most significant progress will receive the grand prize of <span class="highlight">₹15,000</span>!</p>
    <p><a href="mailto:contact@rightintake.com" class="btn">Register Now</a></p>
    <p>Good luck and stay motivated!</p>
  </div>
</body>
</html>

    `;
};

module.exports = {
  sendDietPlanEmail,
  generateEmailContent,
};
