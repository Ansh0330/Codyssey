import axios from "axios";
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const getJudge0LanguageName = (languageId) => {
  const languageMap = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return languageMap[languageId] || "Unknown";
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log("Judge0 submission results(tokens)", data);
  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );

    const results = data.submissions;
    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
    );

    // console.log("Judge0 submission results (polling) ----->", results);
    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }
};