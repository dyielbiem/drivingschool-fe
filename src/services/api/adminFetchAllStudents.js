"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/student/all`;
const adminFetchAllStudents = async (sectionID) => {
  try {
    let ok = true;
    let hasNext = true;
    let page = 1;
    let noOfRows = 0;
    let allStudents = [];

    const fetchMethod = async (accessToken) => {
      const init = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await fetch(
        `${baseURL}?sectionID=${encodeURIComponent(sectionID)}` +
          `&page=${page}&pageSize=100`,
        init
      );

      return response;
    };

    while (hasNext) {
      const { ok: thisOk, json } = await adminRefreshAccessToken(fetchMethod);
      if (!ok) return;

      hasNext = json.hasNext;
      noOfRows = json.noOfRows;
      page += 1;
      ok = thisOk;

      allStudents.push(...json.allStudents);
    }

    return {
      ok,
      json: {
        allStudents,
        noOfRows
      }
    };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchAllStudents;
