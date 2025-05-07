"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart3, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [userUrls, setUserUrls] = useState<
    Array<{
      shortId: string;
      redirectURL: string;
      visitHistory: Array<{ timestamp: string }>;
      createdAt: string;
    }>
  >([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const urlsFetched = useRef(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setIsAdmin(data.role === "ADMIN");
          if (!urlsFetched.current) {
            fetchUserUrls();
            urlsFetched.current = true;
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setAuthLoading(false); // <-- Set loading to false after check
      }
    };

    checkAuth();
  }, []);

  const fetchUserUrls = async () => {
    try {
      setUrlsLoading(true);
      const response = await fetch("/api/urls", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserUrls(data);
      }
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    } finally {
      setUrlsLoading(false);
    }
  };

  const shortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      const shortened = `${window.location.origin}/${data.shortId}`;

      setShortenedUrl(shortened);
      setUrl("");
      fetchUserUrls(); // Refresh the list of URLs

      toast({
        title: "URL shortened successfully!",
        description: "Your shortened URL is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Failed to shorten URL",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The URL has been copied to your clipboard.",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <NextLink href="/" className="flex items-center gap-2">
              {/* <NextLink className="h-8 w-8 text-purple-400" /> */}
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Shortsy
              </h1>
            </NextLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {!authLoading &&
              (isAuthenticated ? (
                <>
                  {isAdmin && (
                    <NextLink href="/admin">
                      <Button
                        variant="ghost"
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        Admin
                      </Button>
                    </NextLink>
                  )}
                  <NextLink href="/api/logout">
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Logout
                    </Button>
                  </NextLink>
                </>
              ) : (
                <>
                  <NextLink href="/login">
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Login
                    </Button>
                  </NextLink>
                  <NextLink href="/signup">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Sign Up
                    </Button>
                  </NextLink>
                </>
              ))}
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shorten Your Links
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Transform your long URLs into short, memorable links with just a
            click.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50 mb-12"
        >
          <form onSubmit={shortenUrl} className="space-y-6">
            <div className="relative">
              <Input
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 pl-12 pr-4 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-purple-500"
              />
              {/* <NextLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /> */}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Shortening...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Shorten URL</span>
                </div>
              )}
            </Button>
          </form>

          {shortenedUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-slate-900/70 rounded-xl border border-purple-500/30"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 truncate">
                  <p className="text-sm text-slate-400 mb-1">
                    Your shortened URL:
                  </p>
                  <p className="text-purple-400 font-medium truncate">
                    {shortenedUrl}
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => copyToClipboard(shortenedUrl)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => window.open(shortenedUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {isAuthenticated && urlsLoading && (
          <div className="flex flex-col justify-center items-center h-24">
            <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-slate-300 text-sm">
              Loading your URLs, please wait…
            </span>
          </div>
        )}

        {isAuthenticated && userUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              {/* <NextLink className="h-5 w-5 text-purple-400" /> */}
              Your Links
            </h2>

            <div className="grid gap-4">
              {userUrls.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-sm text-slate-400 truncate">
                            {item.redirectURL}
                          </p>
                          <p className="text-purple-400 font-medium truncate">{`${window.location.origin}/${item.shortId}`}</p>
                          <p className="text-xs text-slate-500">
                            Created:{" "}
                            {new Date(item.createdAt).toLocaleDateString()} •
                            Clicks: {item.visitHistory.length}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/${item.shortId}`
                              )
                            }
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() =>
                              window.open(
                                `${window.location.origin}/${item.shortId}`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Visit</span>
                          </Button>
                          <NextLink href={`/analytics/${item.shortId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span className="sr-only">Analytics</span>
                            </Button>
                          </NextLink>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Shortsy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
