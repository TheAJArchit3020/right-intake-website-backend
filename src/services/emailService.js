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
  const sendDietPlanEmail = async (to, subject, htmlContent, pdfBuffer, pdfFileName = "diet-plan.pdf") => {
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
      <h1>Your Customized Diet Plan</h1>
      <p>Hello,</p>
      <p>Your personalized 30-day diet plan is ready. Please find the detailed plan attached as a PDF document.</p>
      <p>Stay healthy and achieve your goals!</p>
      <p>Best regards,<br/>The Right Intake Team</p>
    `;
  };
  
  module.exports = {
    sendDietPlanEmail,
    generateEmailContent,
  };
  