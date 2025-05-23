"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminEmailStudentAccountInfo = async (studentUserName) => {
  try {
    const fetchMethod = async (accessToken) => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const response = await fetch(
        `${baseUrl}/api/admin/student/account/email?studentUserName=${studentUserName}`,
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

export default adminEmailStudentAccountInfo;
