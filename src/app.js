const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const seedCheatMeals = require("./utils/seedCheatMeals");
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors());

app.use("/api/diet-plan", require("./routes/dietPlanRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));


const startServer = async () => {
  await connectDB();
  await seedCheatMeals();
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
