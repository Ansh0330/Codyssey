import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();


// ALL USER ROUTES
problemRoutes.get("/get-problems", authMiddleware, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser
);

// ADMIN ROUTES
problemRoutes.post("/create-problem", authMiddleware, isAdmin, createProblem);
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  isAdmin,
  updateProblem
);
problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  isAdmin,
  deleteProblem
);

export default problemRoutes;
