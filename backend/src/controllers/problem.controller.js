import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  // get all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippet,
    referenceSolutions,
  } = req.body;
  // check the user role once again --- user should be an admin
  if (req.user.role !== "ADMIN") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized , User is not an admin",
    });
  }
  // loop through each reference solution for each language
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      // console.log("PRINTING SUBMISSIONS ARRAY ---->", submissions);

      const submissionsResults = await submitBatch(submissions);

      const tokens = submissionsResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("PRINTING RESULT ------> ", results[i]);
        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testcases,
        codeSnippet,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log("Error in createProblem", error);
    res.status(500).json({
      success: false,
      message: "Error creating the problem",
      error: error.message,
    });
  }
};

export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    await db.problem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteProblem", error);
    res.status(500).json({
      success: false,
      message: "Error deleting the problem",
      error: error.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        success: false,
        message: "No problems found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.log("Error in getAllProblems", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all the problems",
      error: error.message,
    });
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.log("Error in getProblemById", error);
    res.status(500).json({
      success: false,
      message: "Error fetching the problem",
      error: error.message,
    });
  }
};
export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Solved Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.log("Error in getAllProblemsSolvedByUser", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all the solved problems",
      error: error.message,
    });
  }
};
