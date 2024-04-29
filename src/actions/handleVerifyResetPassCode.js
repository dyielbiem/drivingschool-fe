"use server";
import adminVerifyResetPasswordCode from "@/services/api/adminVerifyResetPasswordCode";

const handleVerifyResetPassCode = async (
  role,
  verificationToken,
  prevState,
  formData
) => {
  const formDataObject = {
    code: formData.get(`${role}-code`)
  };

  if (role !== "admin")
    return {
      resetPasswordToken: null
    };

  const { ok, json } = await adminVerifyResetPasswordCode(
    verificationToken,
    formDataObject.code
  );

  if (!ok)
    return {
      message: json.error || "An error occurred",
      resetPasswordToken: null
    };

  return {
    resetPasswordToken: json.resetPasswordToken
  };
};

export default handleVerifyResetPassCode;
