"use server";
import sectionInfo from "../../dummy_data/sectionInfo.json";
const adminFetchSectionByID = async (sectionID) => {
  try {
    const response = sectionInfo.find((item) => item.sectionID === sectionID);
    return { ok: true, json: response };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchSectionByID;
