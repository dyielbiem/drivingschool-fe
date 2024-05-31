import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateSectionQuestionToShowCount = async (
  sectionID,
  noOfQuestionsToShow
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/question/shown-count`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            noOfQuestionsToShow,
            sectionID
          })
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminUpdateSectionQuestionToShowCount;
