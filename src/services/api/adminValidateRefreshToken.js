"use server";
const adminValidateRefreshToken = async (refreshToken) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/refresh-token/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );

    const data = await response.json();
    if (!response.ok) throw Error;

    return { ok: true, json: data };
  } catch {
    return { ok: false };
  }
};

export default adminValidateRefreshToken;
