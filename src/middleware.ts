import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect students from instructor routes
    if (pathname.startsWith("/(instructor") && token?.role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/(student)/assignments", req.url));
    }

    // Redirect instructors from student routes (optional)
    if (pathname.startsWith("/(student") && token?.role === "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/(instructor)/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/(instructor/:path*)", "/(student/:path*)"],
};
