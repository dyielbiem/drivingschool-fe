import { create } from "zustand";

export const useStudentsInSection = create((set) => ({
  students: [],
  setStudents: (newValue) => {
    set({ students: newValue });
  }
}));

export const useChapterIndex = create((set) => ({
  chapterIndex: undefined,
  setChapterIndex: (newValue) => {
    set({ chapterIndex: newValue });
  }
}));

export const useSubChapterIndex = create((set) => ({
  subChapterIndex: undefined,
  setSubChapterIndex: (newValue) => {
    set({ subChapterIndex: newValue });
  }
}));

export const useSubChapters = create((set) => ({
  subChapters: undefined,
  setSubChapters: (newValue) => {
    set({ subChapters: newValue });
  },
  setNewSubChapter: (newSubChapter) => {
    set((state) => ({ subChapters: [...state.subChapters, newSubChapter] }));
  }
}));
