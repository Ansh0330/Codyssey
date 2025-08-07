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
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "true",
    },
    headers: {
      "x-rapidapi-key": "3e8b0e4c21mshd5a35b7323fc1d9p15765djsn11399f181bf3",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  const response = await axios.request(options);
  const data = response.data;

  console.log("Judge0 submission results(tokens)", data);
  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "3e8b0e4c21mshd5a35b7323fc1d9p15765djsn11399f181bf3",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;

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
