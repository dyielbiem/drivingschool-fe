"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateChaptersOrder = async (sectionID, chapters) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/chapter/list/order`,
        {
          method: "PATCH",
          body: JSON.stringify({
            sectionID,
            chapters
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

export default adminUpdateChaptersOrder;
