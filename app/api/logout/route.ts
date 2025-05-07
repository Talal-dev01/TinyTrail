import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Create a redirect response to the login page
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Clear the token cookie
  response.cookies.delete("token");

  return response;
}
