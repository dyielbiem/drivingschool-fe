import { NextResponse } from "next/server";
import adminValidateRefreshToken from "./services/api/adminValidateRefreshToken";
import superAdminValidateRefreshToken from "./services/api/superAdminValidateRefreshToken";

export const middleware = async (request) => {
  const pathName = request.nextUrl.pathname;
  const refreshToken = request.cookies.get("refreshToken");
  const adminProtectedRouteRegex = /^\/admin\/.+/;
  const superAdminProtectedRouteRegex = /^\/superadmin\/.+/;

  const redirectToLoginPage = (path) => {
    const response = NextResponse.redirect(request.nextUrl.origin + path);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  };

  /* 
    When a user visits super admin login page and a refresh token exists,
    redirect the user to the protected super admin landing route
  */
  if (pathName === "/superadmin" && refreshToken) {
    return NextResponse.redirect(
      request.nextUrl.origin + "/superadmin/schools"
    );
  }

  /* 
    When a user visits admin login page and a refresh token exists,
    redirect the user to the protected admin landing route
  */
  if (pathName === "/admin" && refreshToken) {
    return NextResponse.redirect(request.nextUrl.origin + "/admin/sections");
  }

  /* 
    When a user visits a protected admin route,
    check if a valid admin refresh token exists
  */
  if (adminProtectedRouteRegex.test(pathName)) {
    if (!refreshToken)
      return NextResponse.redirect(request.nextUrl.origin + "/admin");

    const adminResponse = await adminValidateRefreshToken(refreshToken.value);
    if (adminResponse.ok) return;
    const superAdminResponse = await superAdminValidateRefreshToken(
      refreshToken.value
    );
    if (superAdminResponse.ok)
      return NextResponse.redirect(
        request.nextUrl.origin + "/superadmin/schools"
      );

    return redirectToLoginPage("/admin");
  }

  /* 
    When a user visits a protected super admin route,
    check if a valid super admin refresh token exists
  */
  if (superAdminProtectedRouteRegex.test(pathName)) {
    if (!refreshToken)
      return NextResponse.redirect(request.nextUrl.origin + "/superadmin");

    const superAdminResponse = await superAdminValidateRefreshToken(
      refreshToken.value
    );
    if (superAdminResponse.ok) return;
    const adminResponse = await adminValidateRefreshToken(refreshToken.value);
    if (adminResponse.ok)
      return NextResponse.redirect(request.nextUrl.origin + "/admin/sections");

    return redirectToLoginPage("/superadmin");
  }
};

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"]
};
