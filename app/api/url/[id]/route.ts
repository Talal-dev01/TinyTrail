import { type NextRequest, NextResponse } from "next/server";

// This is a placeholder API route that connects to your Express.js backend
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = params.id;

    // In a real implementation, you would:
    // 1. Forward the request to your Express.js backend
    // 2. Your backend would handle the redirect
    // 3. Return the redirect response

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/url/${url}`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log(data, "data");
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("URL fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
