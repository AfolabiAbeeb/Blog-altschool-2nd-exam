import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// ✅ Add root route here
app.get("/", (req, res) => {
  res.send("Welcome to the Altschool Africa second semester assesment!");
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.error(err));
