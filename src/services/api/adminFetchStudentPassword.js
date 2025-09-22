"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/student/password`;

const adminFetchStudentPassword = async (studentUserName) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${baseUrl}?studentUserName=${studentUserName}`,
        {
          method: "GET",
          headers: {
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

export default adminFetchStudentPassword;
