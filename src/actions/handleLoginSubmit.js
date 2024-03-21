"use server";
import { cookies } from "next/headers";
import loginAdmin from "@/services/api/loginAdmin";
import loginSuperAdmin from "@/services/api/loginSuperAdmin";
import { redirect } from "next/navigation";

const handleLoginSubmit = async (role, redirectPath, prevState, formData) => {
  const formDataObject = {
    userName: formData.get(`${role}-username-input`),
    passWord: formData.get(`${role}-password-input`),
    rememberMe: formData.get("remember-me")
  };

  let response;
  if (role === "admin")
    response = await loginAdmin(
      formDataObject.userName,
      formDataObject.passWord
    );
  if (role === "superadmin")
    response = await loginSuperAdmin(
      formDataObject.userName,
      formDataObject.passWord
    );

  if (!response.ok)
    return {
      message: response?.json?.error
    };

  cookies().set("accessToken", response?.json?.accessToken, {
    sameSite: "lax"
  });
  cookies().set("refreshToken", response?.json?.refreshToken, {
    sameSite: "lax",
    maxAge: formDataObject.rememberMe === "on" ? 86400 * 365 : ""
  });

  redirect(redirectPath);
};

export default handleLoginSubmit;
