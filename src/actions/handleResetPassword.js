"use server";
import adminResetPassword from "@/services/api/adminResetPassword";
import validator from "validator";

const handleResetPassword = async (
  role,
  resetPasswordToken,
  prevState,
  formData
) => {
  const formDataObject = {
    password: formData.get(`${role}-new-password`),
    confirmPassword: formData.get(`${role}-confirm-password`)
  };

  if (role !== "admin")
    return {
      resetPasswordToken: null
    };

  if (formDataObject.password !== formDataObject.confirmPassword)
    return {
      isPasswordReset: false,
      message: "Passwords do not match"
    };

  if (!validator.isStrongPassword(formDataObject.password))
    return {
      isPasswordReset: false,
      message:
        "Password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
    };

  const { ok, json } = await adminResetPassword(
    resetPasswordToken,
    formDataObject.password,
    formDataObject.confirmPassword
  );

  if (!ok)
    return {
      message: json.error || "An error occurred",
      isPasswordReset: false
    };

  return {
    isPasswordReset: true
  };
};

export default handleResetPassword;
