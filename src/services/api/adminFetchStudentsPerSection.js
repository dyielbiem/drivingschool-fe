"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";

const adminFetchStudentsPerSection = async (
  sectionID,
  page,
  sortBy = null,
  search = null
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      let url = `${baseUrl}/api/admin/section/student/list?sectionID=${sectionID}&page=${page}`;

      if (sortBy) {
        url = url + `&sortBy=${sortBy}`;
      }

      if (search) {
        url = url + `&search=${search}`;
      }

      const init = {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
      };

      return await fetch(url, init);
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminFetchStudentsPerSection;
