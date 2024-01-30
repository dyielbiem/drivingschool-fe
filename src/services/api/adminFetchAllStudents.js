"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminFetchAllStudents = async (sectionID) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        }/api/admin/student/all?sectionID=${encodeURIComponent(sectionID)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchAllStudents;
