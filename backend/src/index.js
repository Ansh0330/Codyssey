import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import sheetRoutes from "./routes/sheet.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello guys welcome to Codyssey 🔥");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/sheet", sheetRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
