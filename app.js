const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./app/config/databbase");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./app/routes/authRoutes"));
app.use("/api", require("./app/routes/userRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});