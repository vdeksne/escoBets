"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { AdminUser, UserStatus } from "@/types/user";
import { cn } from "@/lib/utils";

interface UsersViewProps {
  users: AdminUser[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `US$ ${(amount / 1000).toFixed(1)}k`;
  return `US$ ${amount}`;
}

const STATUS_DOT_COLORS: Record<UserStatus, string> = {
  Complete: "bg-emerald-500",
  Pending: "bg-amber-500",
  Failed: "bg-red-500",
  Archived: "bg-zinc-500",
};

export function UsersView({ users }: UsersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const searchFilteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.userName.toLowerCase().includes(q) ||
        u.telegram.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [users, search]);

  const statusCounts = useMemo(() => {
    const counts = { All: searchFilteredUsers.length, Pending: 0, Failed: 0, Complete: 0, Archived: 0 };
    searchFilteredUsers.forEach((u) => {
      counts[u.status]++;
    });
    return counts;
  }, [searchFilteredUsers]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === "All") return searchFilteredUsers;
    return searchFilteredUsers.filter((u) => u.status === statusFilter);
  }, [searchFilteredUsers, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const filteredCount = filteredUsers.length;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" showAdminLinks />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Title */}
          <h1 className="font-gotham text-2xl font-bold text-white md:text-3xl">
            Users <span className="font-light text-white/70">{users.length}</span>
          </h1>

          {/* Search and filter bar */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as UserStatus | "All");
                    setPage(1);
                  }}
                  className="appearance-none rounded-lg border border-white/20 bg-escobets-gray-card px-4 py-2 pr-8 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/30"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Complete">Complete</option>
                  <option value="Archived">Archived</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60">▼</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-48 rounded-lg border border-white/20 bg-escobets-gray-card py-2 pl-9 pr-4 font-gotham text-sm text-white placeholder:text-white/50 focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/30 sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Status tabs */}
          <div className="mt-4 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {(["All", "Pending", "Failed", "Complete", "Archived"] as const).map((status) => {
              const count = status === "All" ? filteredCount : statusCounts[status];
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
                  {status} {count}
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[900px] border-collapse font-gotham text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-escobets-gray-card/50">
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">#</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">User name</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Telegram</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Phone</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Email</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Status</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Last update</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Profits</th>
                  <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-white/70">Losses</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="user-select"
                          value={user.id}
                          className="h-4 w-4 shrink-0 border-white/30 accent-escobets-yellow"
                          aria-label={`Select ${user.userName}`}
                        />
                        <span className="text-white/80">{(page - 1) * rowsPerPage + idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">{user.userName}</td>
                    <td className="px-4 py-3 text-white/90">{user.telegram}</td>
                    <td className="px-4 py-3 text-white/90">{user.phone}</td>
                    <td className="px-4 py-3 text-white/90">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black px-3 py-1 font-medium text-white">
                        <span
                          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT_COLORS[user.status])}
                          aria-hidden
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/80">{user.lastUpdate}</td>
                    <td className="px-4 py-3 text-escobets-yellow">{formatCurrency(user.profits)}</td>
                    <td className="px-4 py-3 text-white/80">{formatCurrency(user.losses)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-gotham text-sm text-white/70">
              {(page - 1) * rowsPerPage + 1}-
              {Math.min(page * rowsPerPage, filteredCount)} of {filteredCount}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="rows-per-page" className="font-gotham text-sm text-white/70">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded border border-white/20 bg-escobets-gray-card px-2 py-1 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded px-3 py-1 font-gotham text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  &lt;
                </button>
                <span className="px-2 font-gotham text-sm text-white">
                  {page}/{totalPages || 1}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded px-3 py-1 font-gotham text-sm text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
