"use server";
import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminUpdateStudent = async (
  studentUserName,
  isActive,
  mailingFirstName,
  mailingLastName,
  mailingAddress,
  mailingCity,
  mailingState,
  mailingZip,
  mailingCountry,
  mailingEmail,
  mailingPhoneNumber,
  mailingCompany
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/student`,
        {
          method: "PATCH",
          body: JSON.stringify({
            studentUserName,
            isActive,
            mailingFirstName,
            mailingLastName,
            mailingAddress,
            mailingCity,
            mailingState,
            mailingZip,
            mailingCountry,
            mailingEmail,
            mailingPhoneNumber,
            mailingCompany
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

export default adminUpdateStudent;
