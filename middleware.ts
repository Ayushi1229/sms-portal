import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/middleware/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log("Middleware checking path:", pathname);
  
  // Public routes (no auth required)
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/setup-account",
    "/unauthorized",
    "/auth-status",
  ];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Allow public routes
  if (isPublicRoute) {
    console.log("Public route, allowing access");
    return NextResponse.next();
  }

  // Verify authentication token
  const token = await verifyToken(request);
  
  console.log("Token verification result:", token ? "Valid token" : "No token");
  
  // Redirect to login if not authenticated
  if (!token) {
    console.log("No token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log("User authenticated with role:", token.roleId);

  // Role-based access control for protected routes
  const roleRouteMapping: Record<string, number[]> = {
    "/dashboard/admin": [1, 2], // super_admin, institutional_admin
    "/dashboard/department": [3], // department_admin
    "/dashboard/mentor": [4], // mentor
    "/dashboard/student": [5], // student
    "/users": [1, 2], // Admin-only routes
    "/institutions": [1], // Super admin only
    "/departments": [1, 2, 3], // Admins
    "/roles": [1], // Super admin only
    "/permissions": [1], // Super admin only
  };

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(roleRouteMapping)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(token.roleId)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

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
