const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();


app.use(express.json());
app.use(require('cors')());

app.use("/api/diet-plan", require("./routes/dietPlanRoutes"));
app.use("/api/user",require("./routes/UserRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
