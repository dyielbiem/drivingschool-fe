const loginAdmin = async (userName, passWord) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: JSON.stringify({ userName, passWord })
      }
    );

    const json = await response.json();
    return { ok: response.ok, json };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default loginAdmin;
