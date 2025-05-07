import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Create a response that will clear the cookie
  const response = NextResponse.json({ success: true });

  // Clear the token cookie
  response.cookies.delete("token");

  return response;
}
