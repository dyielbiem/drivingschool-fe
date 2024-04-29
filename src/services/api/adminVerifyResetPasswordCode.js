const adminVerifyResetPasswordCode = async (
  verificationToken,
  verificationCode
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/reset-password/code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: JSON.stringify({
          verificationToken,
          verificationCode
        }),
        cache: "no-cache"
      }
    );

    const json = await response.json();
    return { ok: response.ok, json };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminVerifyResetPasswordCode;
