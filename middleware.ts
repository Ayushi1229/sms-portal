import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware will be fully implemented in Week 7 (Authentication & Authorization)
// For now, it's a placeholder to demonstrate the routing protection strategy

export function middleware(request: NextRequest) {
  // TODO Week 7: Implement JWT token verification
  // TODO Week 7: Check user role and permissions
  // TODO Week 7: Redirect unauthorized users
  
  const { pathname } = request.nextUrl;
  
  // Public routes (no auth required)
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/setup-account",
  ];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // TODO Week 7: Check authentication token
  // const token = request.cookies.get("token")?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  
  // TODO Week 7: Verify token and extract user role
  // TODO Week 7: Check role-based permissions for the route
  
  // For now, allow all requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files with extensions
     */
    "/((?!api|_next|_static|.*\\..*).*)",
  ],
};
