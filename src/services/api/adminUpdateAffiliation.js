import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminUpdateAffiliation = async (
  affiliationID,
  affiliationName,
  affiliationCode
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/affiliation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            affiliationID,
            affiliationName,
            affiliationCode
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

export default adminUpdateAffiliation;
