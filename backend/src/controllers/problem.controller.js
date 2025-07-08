import { db } from "../libs/db.js";

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

      const submissionsResults = await submitBatch(submissions);

      const tokens = submissionsResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
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
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating the problem",
      error: error.message,
    });
  }
};
export const getAllProblems = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const getAllProblemsSolvedByUser = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
