import { type NextRequest, NextResponse } from "next/server";

// This is a placeholder API route that connects to your Express.js backend
export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Forward the request with cookies to your Express.js backend
    // 2. Your backend would verify the session/JWT
    // 3. Return the user data if authenticated

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/check-auth`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );
    console.log(response, "response called");
    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    );
  }
}
