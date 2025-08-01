"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminDeleteAffiliation = async (affiliationID) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/affiliation`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            affiliationID
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

export default adminDeleteAffiliation;
