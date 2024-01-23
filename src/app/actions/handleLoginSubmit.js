"use server";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import loginAdmin from "@/services/api/loginAdmin";
import loginSuperAdmin from "@/services/api/loginSuperAdmin";
import { redirect } from "next/navigation";

const handleLoginSubmit = async (role, redirectPath, prevState, formData) => {
  const formDataObject = {
    userName: formData.get(`${role}-username-input`),
    passWord: formData.get(`${role}-password-input`)
  };
  const pathname = new URL(headers().get("referer")).pathname;

  let response;
  if (pathname === "/admin")
    response = await loginAdmin(
      formDataObject.userName,
      formDataObject.passWord
    );
  if (pathname === "/superadmin")
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
    sameSite: "lax"
  });

  redirect(redirectPath);
};

export default handleLoginSubmit;
