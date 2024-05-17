"use server";
import validator from "validator";
import adminUpdatePassword from "@/services/api/adminUpdatePassword";

const handleChangePassword = async (prevState, formData) => {
  const formDataObject = {
    oldPassword: formData.get("old-password"),
    newPassword: formData.get("new-password"),
    confirmPassword: formData.get("confirm-password")
  };

  if (formDataObject.newPassword !== formDataObject.confirmPassword)
    return {
      message: "Passwords do not match"
    };

  if (!validator.isStrongPassword(formDataObject.newPassword))
    return {
      message:
        "Password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
    };

  const { ok, json } = await adminUpdatePassword(
    formDataObject.oldPassword,
    formDataObject.newPassword,
    formDataObject.confirmPassword
  );

  if (!ok)
    return {
      message: json.error || "An error occured"
    };

  return {
    successKey: new Date()
  };
};

export default handleChangePassword;
