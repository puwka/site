import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const authCookie = request.cookies.get("admin_auth");
    
    if (authCookie?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  // Передаем путь в заголовке для использования в layout
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  
  return response;
}

export const config = {
  matcher: "/admin/:path*",
};

