"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BarChart3, Copy, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UrlData {
  shortId: string
  redirectURL: string
  visitHistory: Array<{ timestamp: string }>
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [urls, setUrls] = useState<UrlData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.role === "ADMIN") {
            setIsAdmin(true)
            fetchAllUrls()
          } else {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this page",
              variant: "destructive",
            })
            router.push("/")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const fetchAllUrls = async () => {
    try {
      const response = await fetch("/api/admin/urls", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUrls(data)
      }
    } catch (error) {
      console.error("Failed to fetch URLs:", error)
      toast({
        title: "Error",
        description: "Failed to load URL data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUrl = async (shortId: string) => {
    try {
      const response = await fetch(`/api/admin/url/${shortId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setUrls(urls.filter((url) => url.shortId !== shortId))
        toast({
          title: "URL Deleted",
          description: "The URL has been successfully deleted",
        })
      } else {
        throw new Error("Failed to delete URL")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
      description: "The URL has been copied to your clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">All URLs in System</h2>
          <p className="text-slate-400 mb-4">Manage all shortened URLs across all users</p>

          <div className="grid gap-4 mt-6">
            {urls.length > 0 ? (
              urls.map((url, index) => (
                <motion.div
                  key={url.shortId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-sm text-slate-400 truncate">{url.redirectURL}</p>
                          <p className="text-purple-400 font-medium truncate">{`${window.location.origin}/${url.shortId}`}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                            <span>Clicks: {url.visitHistory.length}</span>
                            <span>User: {url.createdBy?.name || "Unknown"}</span>
                            <span>Email: {url.createdBy?.email || "Unknown"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() => copyToClipboard(`${window.location.origin}/${url.shortId}`)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() => window.open(`${window.location.origin}/${url.shortId}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Visit</span>
                          </Button>
                          <Link href={`/analytics/${url.shortId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span className="sr-only">Analytics</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-600/20"
                            onClick={() => deleteUrl(url.shortId)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">No URLs found in the system</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
