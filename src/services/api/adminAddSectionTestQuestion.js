"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminAddSectionTestQuestion = async (
  sectionID,
  question,
  choices,
  correctAnswer
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/question`,
        {
          method: "POST",
          body: JSON.stringify({
            sectionID,
            question,
            choices,
            correctAnswer
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

export default adminAddSectionTestQuestion;
