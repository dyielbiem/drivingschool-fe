"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminFetchChapters = async (sectionID) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        }/api/admin/section/chapter/list?sectionID=${encodeURIComponent(
          sectionID
        )}`,
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

export default adminFetchChapters;
