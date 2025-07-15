import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getAllSubmissions,
  getSubmissionsByProblemId,
  getSubmissionsCountByProblemId,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get(
  "/get-submissions/:problemId",
  authMiddleware,
  getSubmissionsByProblemId
);
submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getSubmissionsCountByProblemId
);

export default submissionRoutes;
