import { create } from "zustand";

export const useStudentsInSection = create((set) => ({
  students: [],
  setStudents: (newValue) => {
    set({ students: newValue });
  }
}));
