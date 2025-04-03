// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("./models/Admin"); // Update path if needed

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://ayush:Ayush3020@rightintake-test.bp2v14m.mongodb.net/rightintake-main-website?retryWrites=true&w=majority&appName=rightintake-test";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "archit@rightitnake.com";
    const password = "Archit@12#";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    console.log("✅ Admin user created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
};

createAdmin();
