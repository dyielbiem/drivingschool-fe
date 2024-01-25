"use server";
import { cookies } from "next/headers";
const adminLogoutClick = () => {
  cookies().set("refreshToken", "", { sameSite: "lax", expires: 0, path: "/" });
  cookies().set("accessToken", "", { sameSite: "lax", expires: 0, path: "/" });
};

export default adminLogoutClick;
