import dotenv from "dotenv";
import express from "express";
dotenv.config();

const mongoose = require("mongoose");
import authRoutes from "./routes/authRoutes.js";

const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.error(err));
