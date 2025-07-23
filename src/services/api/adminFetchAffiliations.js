"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminFetchAffiliations = async () => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/affiliation/list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cache: "no-cache"
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchAffiliations;
