import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/submission/get-all-submissions");
      console.log("GET ALL SUBMISSIONS RESPONSE ---->", res.data);
      set({ submissions: res.data.submissions });

      toast.success(res.data.message);
    } catch (error) {
      console.log("ERROR IN GET ALL SUBMISSIONS (useSubmissionStore)", error);
      toast.error("Error fetching all the submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions/${problemId}`
      );
      console.log("GET SUBMISSIONS FOR PROBLEM RESPONSE ---->", res.data);
      set({ submission: res.data.submissions });
    } catch (error) {
      console.log(
        "ERROR IN GET SUBMISSIONS FOR PROBLEM (useSubmissionStore)",
        error
      );
      toast.error("Error fetching all the submissions");
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );
      console.log("GET SUBMISSIONS COUNT FOR PROBLEM RESPONSE ---->", res.data);
      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log(
        "ERROR IN GET SUBMISSIONS COUNT FOR PROBLEM (useSubmissionStore)",
        error
      );
      toast.error("Error fetching all the submissions");
    }
  },
}));
