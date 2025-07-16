import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToSheet,
  createSheet,
  deleteSheet,
  getAllSheetsDetails,
  getSheetDetails,
  removeProblemFromSheet,
} from "../controllers/sheet.controller.js";

const sheetRoutes = express.Router();

sheetRoutes.get("/", authMiddleware, getAllSheetsDetails);
sheetRoutes.get("/:sheetId", authMiddleware, getSheetDetails);
sheetRoutes.post("/create-sheet", authMiddleware, createSheet);
sheetRoutes.post("/:sheetId/add-problem", authMiddleware, addProblemToSheet);
sheetRoutes.delete("/:sheetId/delete-sheet", authMiddleware, deleteSheet);
sheetRoutes.delete(
  "/:sheetId/remove-problem",
  authMiddleware,
  removeProblemFromSheet
);

export default sheetRoutes;
