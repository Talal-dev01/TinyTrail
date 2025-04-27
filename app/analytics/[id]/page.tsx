"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Calendar, Clock, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface AnalyticsData {
  totalClicks: number;
  shortId: string;
  redirectURL: string;
  createdAt: string;
  visitHistory: Array<{
    timestamp: string;
  }>;
}

function getLocalDateKey(date: any) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/url/analytics/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, router]);

  // Group visits by date
  const visitsByDate =
    analytics?.visitHistory.reduce((acc, visit) => {
      const date = new Date(Number(visit.timestamp));
      const dateKey = getLocalDateKey(date);
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  // Get dates for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - i));
    return getLocalDateKey(date);
  });

  console.log(last7Days, "last7Days");

  // Prepare data for chart
  const chartData = last7Days.map((dateKey) => ({
    dateKey,
    visits: visitsByDate[dateKey] || 0,
  }));

  console.log(chartData, "chartData");
  // Find the max value for scaling
  const maxVisits = Math.max(...chartData.map((d) => d.visits), 1);
  console.log(maxVisits, "maxVisits");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : analytics ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                  Link Analytics
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-300">
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Short URL:</span>
                    <span className="text-purple-400">{`${window.location.origin}/${analytics.shortId}`}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-500">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Created:</span>
                    <span>
                      {new Date(analytics.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 mt-2 truncate">
                  <span className="font-medium">Original URL:</span>{" "}
                  {analytics.redirectURL}
                </p>
              </div>
              <div className="flex items-center justify-center bg-slate-900/50 rounded-xl p-4 min-w-[120px]">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">
                    {analytics.totalClicks}
                  </p>
                  <p className="text-slate-400 text-sm">Total Clicks</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Clicks Over Time</CardTitle>
                  <CardDescription>
                    Last 7 days of link activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end gap-2">
                    {chartData.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-purple-500/30 hover:bg-purple-500/50 rounded-t-sm transition-all duration-200"
                          style={{
                            height:
                              item.visits > 0 ? `${item.visits * 20}px` : "2px",
                            minHeight: item.visits > 0 ? "8px" : "2px",
                            maxHeight: "180px",
                          }}
                        />
                        <div className="text-xs text-slate-400 rotate-45 origin-left translate-y-6 truncate w-full text-center">
                          {new Date(item.dateKey).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Recent Clicks</CardTitle>
                  <CardDescription>
                    Latest visitors to your link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.visitHistory.length > 0 ? (
                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                      {analytics.visitHistory
                        .slice(0, 10)
                        .map((visit, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-slate-700/50 pb-2"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300">
                                {new Date(
                                  Number(visit.timestamp)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-slate-400">
                      No clicks recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-2">
              Link not found
            </h2>
            <p className="text-slate-400 mb-6">
              The requested analytics could not be found.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
