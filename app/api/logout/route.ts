import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Create a redirect response to the login page
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Properly remove the token cookie by setting it to expire
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
