import { db } from "../libs/db.js";
export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.log("Error in getAllSubmissions", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all the submissions",
      error: error.message,
    });
  }
};
export const getSubmissionsByProblemId = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submission = db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions by Id fetched successfully",
      submission,
    });
  } catch (error) {
    console.log("Error in getSubmissionsByProblemId", error);
    res.status(500).json({
      success: false,
      message: "Error fetching the submissions of this problem",
      error: error.message,
    });
  }
};
export const getSubmissionsCountByProblemId = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Count by Id fetched successfully",
      count: submission,
    });
  } catch (error) {
    console.log("Error in getSubmissionsCountByProblemId", error);
    res.status(500).json({
      success: false,
      message: "Error fetching the count of the submissions",
      error: error.message,
    });
  }
};
