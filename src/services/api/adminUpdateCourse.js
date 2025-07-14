"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateCourse = async (
  courseID,
  courseName,
  coursePrice,
  courseDesc,
  isActive
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/course`,
        {
          method: "PATCH",
          body: JSON.stringify({
            courseID,
            courseName,
            coursePrice,
            courseDesc,
            isActive
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

export default adminUpdateCourse;
