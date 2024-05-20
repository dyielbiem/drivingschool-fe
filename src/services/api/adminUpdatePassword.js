"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdatePassword = async (
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/password`,
        {
          method: "PATCH",
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword
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

export default adminUpdatePassword;
