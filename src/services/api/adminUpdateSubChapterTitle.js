import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateSubChapterTitle = async (subChapterID, subChapterTitle) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/chapter/subchapter/title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ subChapterID, subChapterTitle })
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminUpdateSubChapterTitle;
