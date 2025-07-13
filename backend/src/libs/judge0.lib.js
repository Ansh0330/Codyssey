import axios from "axios";
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
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

// export const submitBatch = async (submissions) => {
//   const options = {
//     method: "POST",
//     url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//     params: {
//       base64_encoded: "true",
//     },
//     headers: {
//       "x-rapidapi-key": "3e8b0e4c21mshd5a35b7323fc1d9p15765djsn11399f181bf3",
//       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: submissions,
//   };

//   try {
//     const response = await axios.request(options);
//     console.log("Judge0 submission results(tokens)", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

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

// export const pollBatchResults = async (tokens) =>{
//   const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: tokens.join(","),
//     base64_encoded: 'true',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': '3e8b0e4c21mshd5a35b7323fc1d9p15765djsn11399f181bf3',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

//   const data = await axios.request(options);
//   console.log("Judge0 submission results (polling) ----->", data.data);
//   return data.data

// }