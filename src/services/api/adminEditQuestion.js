"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminEditQuestion = async (
  questionID,
  question,
  correctAnswer,
  otherChoices
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/question`,
        {
          method: "PATCH",
          body: JSON.stringify({
            questionID,
            question,
            correctAnswer,
            otherChoices
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

export default adminEditQuestion;
