const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

const createOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, 
    currency,
    payment_capture: 1, 
  };

  return await razorpay.orders.create(options);
};

module.exports = { createOrder };
