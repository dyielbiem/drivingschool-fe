"use server";
import studentSections from "../../dummy_data/enrolledStudents.json";

const adminFetchStudentExamDetails = (sectionID) => {
  try {
    const response = studentSections.filter(
      (item) => item.sectionID === sectionID
    );

    return { ok: true, json: { examDetails: response } };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchStudentExamDetails;
