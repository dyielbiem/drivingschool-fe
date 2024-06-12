"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminFetchSubChaptersProgress = async (chapterID, studentUserName) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        }/api/admin/section/chapter/subchapter/progress/list?chapterID=${encodeURIComponent(
          chapterID
        )}&studentUserName=${encodeURIComponent(studentUserName)}`,
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

export default adminFetchSubChaptersProgress;
