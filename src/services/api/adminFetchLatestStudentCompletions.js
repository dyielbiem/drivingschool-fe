"use server";
import studentSections from "../../dummy_data/enrolledStudents.json";

const adminFetchLatestStudentCompletions = (sectionID) => {
  try {
    const response = studentSections.filter(
      (item) => item.sectionID === sectionID
    );

    return { ok: true, json: { latestCompletions: response } };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchLatestStudentCompletions;
