import { adminRefreshAccessToken } from "./refreshAccessToken";
const adminAddStudent = async (
  userName,
  passWord,
  confirmPassWord,
  courseID,
  firstName,
  lastName,
  highSchool,
  address,
  city,
  state,
  zip,
  country,
  birthDate,
  email,
  phoneNumber,
  parentFirstName,
  parentLastName,
  parentEmail,
  parentPhoneNumber
) => {
  try {
    const fetchMethod = async (accessToken) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/admin/student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            userName,
            passWord,
            confirmPassWord,
            courseID,
            firstName,
            lastName,
            highSchool,
            address,
            city,
            state,
            zip,
            country,
            birthDate,
            email,
            phoneNumber,
            parentFirstName,
            parentLastName,
            parentEmail,
            parentPhoneNumber
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

export default adminAddStudent;
