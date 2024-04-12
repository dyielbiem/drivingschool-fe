"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateSubChaptersOrder = async (chapterID, subChapters) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/chapter/subchapter/list/order`,
        {
          method: "PATCH",
          body: JSON.stringify({
            chapterID,
            subChapters
          }),
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

export default adminUpdateSubChaptersOrder;
