import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminCreateSection = async (sectionTitle) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ sectionTitle })
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminCreateSection;
