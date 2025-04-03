const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const blogRoutes = require("./routes/blogRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes.adminRouter);
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
