"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { NewsPostAdmin, NewsPostStatus } from "@/types/news-post";
import { cn } from "@/lib/utils";

interface UpdatesStats {
  totalPosts: number;
  newPosts: number;
  livePosts: number;
  totalViews: string;
}

interface UpdatesViewProps {
  posts: NewsPostAdmin[];
  stats: UpdatesStats;
}

const STATUS_DOT_COLORS: Record<NewsPostStatus, string> = {
  Live: "bg-emerald-500",
  Completed: "bg-blue-500",
  Pending: "bg-amber-500",
  Canceled: "bg-zinc-500",
};

export function UpdatesView({ posts, stats }: UpdatesViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<NewsPostStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(11);

  const filteredPosts = useMemo(() => {
    let result = posts;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }
    return result;
  }, [posts, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { All: posts.length, Live: 0, Completed: 0, Pending: 0, Canceled: 0 };
    posts.forEach((p) => {
      counts[p.status]++;
    });
    return counts;
  }, [posts]);

  const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredPosts.slice(start, start + rowsPerPage);
  }, [filteredPosts, page, rowsPerPage]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" showAdminLinks />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Title and actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-gotham text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
              News and Predictions Admin
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href="/updates/new"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-escobets-yellow bg-transparent px-4 py-2 font-gotham font-medium text-escobets-yellow transition hover:bg-escobets-yellow/10"
              >
                <span className="text-lg leading-none">+</span>
                Add New
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-escobets-gray-card px-4 py-2 font-gotham text-sm font-medium text-white transition hover:bg-white/5"
              >
                <span className="font-bold">⋮</span>
                More Action
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Posts", value: String(stats.totalPosts) },
              { label: "New Posts", value: String(stats.newPosts) },
              { label: "Live Posts", value: String(stats.livePosts) },
              { label: "Total Views", value: stats.totalViews },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="relative rounded-xl border border-white/10 bg-escobets-gray-card p-4"
              >
                <button
                  type="button"
                  className="absolute right-2 top-2 text-white/40 hover:text-white/70"
                  aria-label="More options"
                >
                  ⋮
                </button>
                <p className="font-gotham text-sm text-white/70">{label}</p>
                <p className="mt-2 font-gotham text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs and toolbar */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 sm:border-0 sm:pb-0">
              {(["All", "Completed", "Pending", "Canceled"] as const).map((status) => {
                const label = status === "All" ? `All posts (${statusCounts.All})` : status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setPage(1);
                    }}
                    className={cn(
                      "rounded-lg px-4 py-2 font-gotham text-sm transition",
                      statusFilter === status
                        ? "bg-white/10 text-escobets-yellow"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-40 rounded-lg border border-white/20 bg-escobets-gray-card py-2 pl-9 pr-4 font-gotham text-sm text-white placeholder:text-white/50 focus:border-escobets-yellow/50 focus:outline-none sm:w-48"
                />
                <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Sort"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="More options"
              >
                ⋮
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[600px] border-collapse font-gotham text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-escobets-gray-card/50">
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">No.</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Title</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Date</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post, idx) => (
                  <tr key={post.id} className="border-b border-white/5 transition hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/30 accent-escobets-yellow"
                          aria-label={`Select ${post.title}`}
                        />
                        <span className="text-white/80">{(page - 1) * rowsPerPage + idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-white/10">
                          <Image
                            src={post.thumbnailUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <span className="font-medium text-white">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/80">{post.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black px-3 py-1 font-medium text-white">
                        <span
                          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT_COLORS[post.status])}
                          aria-hidden
                        />
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="font-gotham text-sm text-white/80 hover:text-white disabled:opacity-50"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg font-gotham text-sm",
                    page === p ? "bg-escobets-yellow text-black" : "text-white/80 hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="px-2 font-gotham text-white/50">...</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg font-gotham text-sm",
                      page === totalPages ? "bg-escobets-yellow text-black" : "text-white/80 hover:bg-white/10"
                    )}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="font-gotham text-sm text-white/80 hover:text-white disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
