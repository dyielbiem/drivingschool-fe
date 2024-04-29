"use server";
import adminGetResetPasswordCode from "@/services/api/adminGetResetPasswordCode";

const handleGetResetPassCode = async (role, prevState, formData) => {
  const formDataObject = {
    username: formData.get(`${role}-username`)
  };

  if (role !== "admin")
    return {
      verificationToken: null
    };

  const { ok, json } = await adminGetResetPasswordCode(formDataObject.username);

  if (!ok)
    return {
      message: json.error || "An error occurred",
      verificationToken: null
    };

  return {
    verificationToken: json.verificationToken,
    username: formDataObject.username
  };
};

export default handleGetResetPassCode;
