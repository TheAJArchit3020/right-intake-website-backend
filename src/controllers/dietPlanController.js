const dietPlanQueue = require("../services/RedisandBullQueue");
const User = require("../models/User");
const crypto = require("crypto");
const { createOrder } = require("../services/razorpayService");
const {  generateFoodPreferencesPrompt, retryRequest} = require("../utils/foodPreferencesUtils");
const axios = require("axios");
const { extractWrappedJSON } = require("../utils/dietPlanUtils");


exports.saveUserData = async (req, res) => {
  const userData = req.body;

  try {
    console.log("Saving user data...");
    const user = new User(userData);
    await user.save();

    res.status(200).json({ message: "User data saved successfully", userId: user._id });
  } catch (error) {
    console.error("Error saving user data:", error.message);
    res.status(500).json({ message: "Failed to save user data" });
  }
};


exports.initiatePayment = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    if (!userId || !amount) {
      return res.status(400).json({ message: "userId and amount are required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email; 
    console.log(`Initiating payment for userId: ${userId}, email: ${email}, amount: ${amount}`);

    const order = await createOrder(amount);
    res.status(200).json({
      message: "Payment initiated successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    if (!userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature. Payment verification failed." });
    }

    console.log(`Payment verified for order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`);

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email;
    console.log(`Adding diet plan generation job to queue for userId: ${userId}, email: ${email}`);

    await dietPlanQueue.add({ userId, email });

    res.status(200).json({ message: "Payment verified and diet plan generation started." });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

exports.generateFoodPreferences = async (req, res) => {
  const { location } = req.body;

  try {
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    console.log("Generating food preferences for:", location);

    const prompt = generateFoodPreferencesPrompt(location);

    const response = await retryRequest(() =>
      axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert nutritionist and food consultant." },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
          temperature: 0.7,
        },
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        }
      )
    );

    const rawResponse = response.data.choices[0].message.content;
    const foodPreferences = extractWrappedJSON(rawResponse); 

    res.status(200).json(foodPreferences);
  } catch (error) {
    console.error("Error generating food preferences:", error.message);
    res.status(500).json({ message: "Failed to generate food preferences" });
  }
};