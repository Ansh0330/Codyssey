import { db } from "../libs/db.js";
import {
  getJudge0LanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
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
    console.log(results);

    // Analyze the testcase results
    let allPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[index]?.trim();

      const passed = stdout === expected_output;
      if (!passed) allPassed = false;

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compiled_output: result.compiled_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
      // console.log("Testcase ", index + 1, ":");
      // console.log(`Input ${stdin[index]}`);
      // console.log(`Expected output for this testcase ${expected_output}`);
      // console.log(`Actual output ${stdout}`);
      // console.log("isMatched ", passed);
    });

    console.log("Detailed Results ---->", detailedResults);

    // store the submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getJudge0LanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
        stderr: detailedResults.some((result) => result.stderr)
          ? JSON.stringify(detailedResults.map((result) => result.stderr))
          : null,
        compliedOutput: detailedResults.some((result) => result.compiled_output)
          ? JSON.stringify(
              detailedResults.map((result) => result.compiled_output)
            )
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((result) => result.memory)
          ? JSON.stringify(detailedResults.map((result) => result.memory))
          : null,
        time: detailedResults.some((result) => result.time)
          ? JSON.stringify(detailedResults.map((result) => result.time))
          : null,
      },
    });

    // if all passed = true ,mark problem solved , for the current user

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // save individual testcase results using detailedResults
    const testcaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    const submissionWithTestCase = db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCaseResults: true,
      },
    });

    await db.testCaseResult.createMany({
      data: testcaseResults,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Code executed successfully",
        submission: submissionWithTestCase,
      });
  } catch (error) {
    console.log("Error in executeCode", error);
    res.status(500).json({
      success: false,
      message: "Error executing the code",
      error: error.message,
    });
  }
};
