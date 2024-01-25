"use server";
import enrolledStudents from "../../dummy_data/enrolledStudents.json";
const adminFetchAllStudents = async (sectionID) => {
  try {
    const response = enrolledStudents.filter(
      (item) => item.sectionID === sectionID
    );

    return { ok: true, json: { students: response } };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchAllStudents;
