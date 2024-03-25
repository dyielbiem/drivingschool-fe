import { create } from "zustand";

export const useStudentsInSection = create((set) => ({
  students: [],
  noOfRows: 0,
  setStudents: (newValue) => {
    set({ students: newValue });
  },
  setNoOfRows: (rows) => {
    set({ noOfRows: rows });
  }
}));

export const useChapters = create((set) => ({
  chapters: undefined,
  setChapters: (newValue) => {
    set({ chapters: newValue });
  },
  setNewChapter: (newChapter) => {
    set((state) => ({ chapters: [...state.chapters, newChapter] }));
  },
  setUpdatedChapter: (updatedChapter) => {
    set((state) => ({
      chapters: state?.chapters.map((chapter) => {
        if (chapter.chapterID !== updatedChapter?.chapterID) return chapter;
        chapter.chapterTitle = updatedChapter?.chapterTitle;
        return chapter;
      })
    }));
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
  },
  setUpdatedSubChapter: (updatedSubChapter) => {
    set((state) => ({
      supChapters: state?.subChapters.map((subChapter) => {
        if (subChapter.subChapterID !== updatedSubChapter?.subChapterID)
          return subChapter;
        subChapter.subChapterTitle = updatedSubChapter?.subChapterTitle;
        return subChapter;
      })
    }));
  }
}));

export const useSectionTestQuestions = create((set) => ({
  sectionTestQuestions: undefined,
  setSectionTestQuestions: (newValue) => {
    set({ sectionTestQuestions: newValue });
  },
  setNewSectionTestQuestion: (newSectionTestQuestion) => {
    set((state) => ({
      sectionTestQuestions: [
        ...state.sectionTestQuestions,
        newSectionTestQuestion
      ]
    }));
  },
  setUpdateSectionTestQuestion: (updatedQuestion) => {
    set((state) => ({
      sectionTestQuestions: state?.sectionTestQuestions.map((question) => {
        if (updatedQuestion.questionID !== question.questionID) return question;
        question.question = updatedQuestion.question;
        question.choices = updatedQuestion.choices;
        question.correctAnswer = updatedQuestion.correctAnswer;
        return question;
      })
    }));
  }
}));

export const useChapterTestQuestions = create((set) => ({
  chapterTestQuestions: undefined,
  setChapterTestQuestions: (newValue) => {
    set({ chapterTestQuestions: newValue });
  },
  setNewChapterTestQuestion: (newChapterTestQuestion) => {
    set((state) => ({
      chapterTestQuestions: [
        ...state.chapterTestQuestions,
        newChapterTestQuestion
      ]
    }));
  },
  setUpdateChapterTestQuestion: (updatedQuestion) => {
    set((state) => ({
      chapterTestQuestions: state?.chapterTestQuestions.map((question) => {
        if (updatedQuestion.questionID !== question.questionID) return question;
        question.question = updatedQuestion.question;
        question.choices = updatedQuestion.choices;
        question.correctAnswer = updatedQuestion.correctAnswer;
        return question;
      })
    }));
  }
}));
