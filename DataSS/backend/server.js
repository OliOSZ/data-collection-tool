import("dotenv/config");
import express from "express";
import cors from "cors";

import authRoutes from "routes/authRoutes";
import answerRoutes from "./routes/answerRoutes";
import surveyRoutes from "./routes/surveyRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/answers", answerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello, world" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
