import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Forward the request with cookies to your Express.js backend
    // 2. Your backend would verify admin role and fetch all URLs
    // 3. Return the URLs data

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Admin URLs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 })
  }
}
