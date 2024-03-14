import { NextResponse } from "next/server";

export function middleware(request) {
  const pathName = request.nextUrl.pathname;
  const refreshToken = request.cookies.get("refreshToken");

  if (pathName === "/superadmin" && refreshToken)
    return NextResponse.redirect(request.url + "/schools");

  if (pathName === "/admin" && refreshToken)
    return NextResponse.redirect(request.url + "/sections");

  const adminRegex = /^\/admin\/.+/;
  const superAdminRegex = /^\/superadmin\/.+/;

  if (adminRegex.test(pathName) && !refreshToken)
    return NextResponse.redirect(request.nextUrl.origin + "/admin");

  if (superAdminRegex.test(pathName) && !refreshToken)
    return NextResponse.redirect(request.nextUrl.origin + "/superadmin");
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"]
};
