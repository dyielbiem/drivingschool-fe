"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminUpdateStripeKey = async (secretKey) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/driving-school/stripe/secret-key`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ secretKey })
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminUpdateStripeKey;
