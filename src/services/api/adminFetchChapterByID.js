"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminFetchChapterByID = async (chapterID) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        }/api/admin/section/chapter?chapterID=${encodeURIComponent(chapterID)}`,
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

export default adminFetchChapterByID;
