import { NextResponse } from "next/server";

export function middleware(request) {
  const pathName = request.nextUrl.pathname;
  const refreshToken = request.cookies.get("refreshToken");

  if (pathName === "/superadmin" && refreshToken)
    return NextResponse.redirect(request.url + "/schools");

  if (pathName === "/admin" && refreshToken)
    return NextResponse.redirect(request.url + "/sections");
}

export const config = {
  matcher: ["/admin", "/superadmin"]
};
