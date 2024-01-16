import Cookies from "js-cookie";

export const adminRefreshAccessToken = async (fetchMethod) => {
  try {
    // Get access token
    const accessToken = Cookies.get("accessToken");

    // Invoke the fetch method
    const response = await fetchMethod(accessToken);
    const json = await response.json();
    if (response.ok) return { ok: true, json };
    if (json.error != "TokenExpiredError") return { ok: false, json };

    // Obtain new access token if the old access token is expired
    const refreshToken = Cookies.get("refreshToken");
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/access-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );
    const refreshJSON = await refreshResponse.json();

    if (!refreshResponse.ok) return { ok: false, json: refreshJSON };
    Cookies.set("accessToken", refreshJSON.accessToken);

    // Invoke the fetch method again using the new access token
    const refreshedAccessToken = Cookies.get("accessToken");
    const retryResponse = await fetchMethod(refreshedAccessToken);
    const retryJSON = await retryResponse.json();

    return { ok: retryResponse.ok, json: retryJSON };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};
