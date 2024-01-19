import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminAddCourse = async (
  courseName,
  courseDesc,
  coursePrice,
  courseType
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            courseName,
            courseDesc,
            coursePrice,
            courseType
          })
        }
      );

      return response;
    };

    return await adminRefreshAccessToken(fetchMethod);
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminAddCourse;
