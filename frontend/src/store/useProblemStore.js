import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isSolvedProblemsLoading: false,

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-problems");
      console.log("GET ALL PROBLEMS RESPONSE ---->", res.data);
      set({ problems: res.data.problems });
    } catch (error) {
      console.log("ERROR IN GET ALL PROBLEMS (useProblemStore)", error);
      toast.error("Error fetching all the problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      console.log("GET PROBLEM BY ID RESPONSE ---->", res.data);
      set({ problem: res.data.problem });
      toast.success(res.data.message);
    } catch (error) {
      console.log("ERROR IN GET PROBLEM BY ID (useProblemStore)", error);
      toast.error("Error fetching the problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    set({ isSolvedProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      console.log("GET SOLVED PROBLEMS BY USER RESPONSE ---->", res.data);
      set({ solvedProblems: res.data.problems });
      toast.success(res.data.message);
    } catch (error) {
      console.log(
        "ERROR IN GET SOLVED PROBLEMS BY USER (useProblemStore)",
        error
      );
      toast.error("Error fetching all the solved problems");
    } finally {
      set({ isSolvedProblemsLoading: false });
    }
  },
}));
