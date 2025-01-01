const dietPlanQueue = require("../services/RedisandBullQueue");
const User = require("../models/User");
const crypto = require("crypto");
const { createOrder } = require("../services/razorpayService");
const {  generateFoodPreferencesPrompt, retryRequest, extractWrappedJSONForFoodPreferences} = require("../utils/foodPreferencesUtils");
const axios = require("axios");
const { extractWrappedJSON } = require("../utils/dietPlanUtils");
const TemporaryUser = require("../models/TemporaryUser");

require("dotenv").config();

exports.saveTemporaryUserData = async (req, res) => {
  const userData = req.body;

  try {
    console.log("Saving temporary user data...");
    const tempUser = new TemporaryUser(userData);
    await tempUser.save();

    res.status(200).json({ message: "Temporary user data saved successfully", tempUserId: tempUser._id });
  } catch (error) {
    console.error("Error saving temporary user data:", error.message);
    res.status(500).json({ message: "Failed to save temporary user data" });
  }
};



exports.initiatePayment = async (req, res) => {
  const { tempUserId, amount } = req.body;

  try {
    if (!tempUserId || !amount) {
      return res.status(400).json({ message: "tempUserId and amount are required" });
    }

    const tempUser = await TemporaryUser.findById(tempUserId);
    if (!tempUser) {
      return res.status(404).json({ message: "Temporary user not found" });
    }

    console.log(`Initiating payment for tempUserId: ${tempUserId}, email: ${tempUser.email}, amount: ${amount}`);
    const order = await createOrder(amount);
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

    res.status(200).json({
      message: "Payment initiated successfully",
      orderId: order.id,
      razorpayKeyId,
    });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { tempUserId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    if (!tempUserId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature. Payment verification failed." });
    }

    const tempUser = await TemporaryUser.findById(tempUserId);
    if (!tempUser) {
      return res.status(404).json({ message: "Temporary user not found" });
    }

    if (tempUser.paymentStatus === "SUCCESS") {
      return res.status(200).json({ message: "Payment already processed." });
    }

    const user = new User(tempUser.toObject());
    delete user._id; 
    await user.save();

    await TemporaryUser.deleteOne({ _id: tempUserId });

    console.log(`Adding diet plan generation job to queue for userId: ${user._id}`);
    await dietPlanQueue.add({ userId: user._id, email: user.email });

    res.status(200).json({ message: "Payment verified, diet plan generation in progress" });
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
    const foodPreferences = extractWrappedJSONForFoodPreferences(rawResponse);

    res.status(200).json(foodPreferences);
  } catch (error) {
    console.error("Error generating food preferences:", error.message);
    res.status(500).json({ message: "Failed to generate food preferences" });
  }
};


