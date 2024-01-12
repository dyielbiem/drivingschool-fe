import Cookies from "js-cookie";

const adminFetchSections = async () => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/section/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const json = await response.json();
    return { ok: response.ok, json };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchSections;
