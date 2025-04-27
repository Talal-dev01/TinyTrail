import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real implementation, you would:
    // 1. Forward the request to your Express.js backend
    // 2. Your backend would verify admin role and delete the URL
    // 3. Return success or error

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/url/${id}`, {
      method: "DELETE",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("URL deletion error:", error)
    return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 })
  }
}
