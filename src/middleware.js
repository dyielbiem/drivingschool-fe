import { NextResponse } from "next/server";

export function middleware(request) {
  const pathName = request.nextUrl.pathname;
  const refreshToken = request.cookies.get("refreshToken");
  const isLoginPath = pathName === "/admin" || pathName === "/superadmin";

  if (isLoginPath && refreshToken)
    return NextResponse.redirect(request.url + "/dashboard");
}

export const config = {
  matcher: ["/admin", "/superadmin"]
};
