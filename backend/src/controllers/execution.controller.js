import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output, problemId } =
      req.body;

    const userId = req.user.id;

    // validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Missing test cases",
      });
    }

    // prepare each test cases for judge0 batch submission

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    //send this batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);

    //poll judge0 for results
    const results = await pollBatchResults(tokens);

    res
      .status(200)
      .json({ success: true, message: "Code executed successfully" });
  } catch (error) {
    console.log("Error in executeCode", error);
    res.status(500).json({
      success: false,
      message: "Error executing the code",
      error: error.message,
    });
  }
};
