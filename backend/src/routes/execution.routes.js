import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/execution.controller.js";

const executionRoutes = express.Router();

executionRoutes.post("/", authMiddleware, executeCode);

export default executionRoutes;
