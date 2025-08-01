"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminFetchAffiliationStudents = async (affilaitionID) => {
  try {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${backendURL}/api/admin/affiliation/student/list?affiliationID=${affilaitionID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cache: "no-cache"
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchAffiliationStudents;
