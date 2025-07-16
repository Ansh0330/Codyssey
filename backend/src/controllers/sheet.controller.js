import { db } from "../libs/db.js";
export const getAllSheetsDetails = async (req, res) => {
  try {
    const sheets = await db.sheet.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Sheets fetched successfully",
      sheets,
    });
  } catch (error) {
    console.log("Error in getAllSheetsDetails", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all the sheets",
      error: error.message,
    });
  }
};
export const getSheetDetails = async (req, res) => {
  try {
    const { sheetId } = req.params;
    if (!sheetId) {
      return res.status(400).json({
        success: false,
        message: "Sheet Id is required",
      });
    }
    const sheet = await db.sheet.findUnique({
      where: {
        id: sheetId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet with this Id is not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Sheet fetched successfully",
      sheet,
    });
  } catch (error) {
    console.log("Error in getSheetDetails", error);
    res.status(500).json({
      success: false,
      message: "Error fetching the particular sheet",
      error: error.message,
    });
  }
};
export const createSheet = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const existingSheet = await db.sheet.findUnique({
      where: {
        name,
      },
    });
    if (existingSheet) {
      return res.status(400).json({
        success: false,
        message: "Sheet with same name already exists",
      });
    }

    const newSheet = await db.sheet.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sheet created successfully",
      newSheet,
    });
  } catch (error) {
    console.log("Error in createSheet", error);
    res.status(500).json({
      success: false,
      message: "Error creating the sheet",
      error: error.message,
    });
  }
};
export const addProblemToSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Problem Ids are required",
      });
    }

    const sheet = await db.sheet.findUnique({
      where: {
        id: sheetId,
      },
    });
    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet with this Id is not found",
      });
    }

    // create records for each problem in the playlist
    const problemsInSheet = await db.problemInSheet.createMany({
      data: problemIds.map((problemId) => ({
        sheetId: sheetId,
        problemId: problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problem added to sheet successfully",
      problemsInSheet,
    });
  } catch (error) {
    console.log("Error in addProblemToSheet", error);
    res.status(500).json({
      success: false,
      message: "Error in adding problem to sheet",
      error: error.message,
    });
  }
};
export const deleteSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;

    const deletedSheet = await db.sheet.delete({
      where: {
        id: sheetId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Sheet deleted successfully",
      deletedSheet,
    });
  } catch (error) {
    console.log("Error in deleteSheet", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting the sheet",
      error: error.message,
    });
  }
};
export const removeProblemFromSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Problem Ids are required",
      });
    }

    const deletedProblemsInSheet = await db.problemInSheet.deleteMany({
      where: {
        sheetId: sheetId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem removed from sheet successfully",
      deletedProblemsInSheet,
    });
  } catch (error) {
    console.log("Error in removeProblemFromSheet", error);
    res.status(500).json({
      success: false,
      message: "Error in removing the problem from sheet",
      error: error.message,
    });
  }
};
