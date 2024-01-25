"use server";
import studentSections from "../../dummy_data/studentSections.json";
const adminFetchStudentSections = async () => {
  try {
    const response = studentSections;
    return { ok: true, json: { studentSections: response } };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchStudentSections;
