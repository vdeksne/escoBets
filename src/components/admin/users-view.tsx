"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { AdminUser, UserStatus } from "@/types/user";
import { cn } from "@/lib/utils";

interface UsersViewProps {
  users: AdminUser[];
  /** Called after successful delete to reload from the API. */
  onRefresh?: () => void | Promise<void>;
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

type SortKey =
  | "userName"
  | "telegram"
  | "phone"
  | "email"
  | "status"
  | "lastUpdate"
  | "profits"
  | "losses";

/** Parse display strings like "01 Mar 2026, 09:00" for ordering. */
function lastUpdateSortValue(s: string): number {
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

function compareUsers(a: AdminUser, b: AdminUser, key: SortKey): number {
  switch (key) {
    case "userName":
      return a.userName.localeCompare(b.userName, undefined, { sensitivity: "base" });
    case "telegram":
      return a.telegram.localeCompare(b.telegram, undefined, { sensitivity: "base" });
    case "phone":
      return a.phone.localeCompare(b.phone, undefined, { numeric: true });
    case "email":
      return a.email.localeCompare(b.email, undefined, { sensitivity: "base" });
    case "status":
      return a.status.localeCompare(b.status);
    case "lastUpdate":
      return lastUpdateSortValue(a.lastUpdate) - lastUpdateSortValue(b.lastUpdate);
    case "profits":
      return a.profits - b.profits;
    case "losses":
      return a.losses - b.losses;
    default:
      return 0;
  }
}

function SortableTh({
  label,
  columnKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  columnKey: SortKey;
  activeKey: SortKey | null;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === columnKey;
  return (
    <th
      className="px-2.5 py-2 text-left text-xs font-medium uppercase tracking-wider text-white/70"
      scope="col"
      aria-sort={
        active ? (dir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="inline-flex max-w-full items-center gap-1.5 rounded text-left hover:text-white"
      >
        <span>{label}</span>
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3 shrink-0 text-escobets-yellow" aria-hidden />
          ) : (
            <ArrowDown className="h-3 w-3 shrink-0 text-escobets-yellow" aria-hidden />
          )
        ) : (
          <ArrowUpDown
            className="h-3 w-3 shrink-0 text-white/40"
            aria-hidden
          />
        )}
      </button>
    </th>
  );
}

export function UsersView({ users, onRefresh }: UsersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const selectAllOnPageRef = useRef<HTMLInputElement>(null);

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

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedUsers = useMemo(() => {
    if (!sortKey) return filteredUsers;
    const mult = sortDir === "asc" ? 1 : -1;
    return [...filteredUsers].sort((a, b) => {
      const c = compareUsers(a, b, sortKey);
      if (c !== 0) return c * mult;
      return a.id.localeCompare(b.id);
    });
  }, [filteredUsers, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedUsers.slice(start, start + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  function handleSortColumn(key: SortKey) {
    setPage(1);
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const selectedOnPageCount = useMemo(
    () => paginatedUsers.filter((u) => selectedIds.has(u.id)).length,
    [paginatedUsers, selectedIds]
  );
  const allOnPageSelected =
    paginatedUsers.length > 0 && selectedOnPageCount === paginatedUsers.length;
  const someOnPageSelected =
    selectedOnPageCount > 0 && selectedOnPageCount < paginatedUsers.length;

  useEffect(() => {
    const el = selectAllOnPageRef.current;
    if (el) el.indeterminate = someOnPageSelected;
  }, [someOnPageSelected]);

  const filteredCount = sortedUsers.length;

  function toggleSelectAllOnPage() {
    setDeleteError(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginatedUsers.forEach((u) => next.delete(u.id));
      } else {
        paginatedUsers.forEach((u) => next.add(u.id));
      }
      return next;
    });
  }

  function toggleRow(id: string) {
    setDeleteError(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0 || isDeleting) return;
    const ids = [...selectedIds];
    const ok = window.confirm(
      `Delete ${ids.length} user${ids.length === 1 ? "" : "s"}? This cannot be undone.`
    );
    if (!ok) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const payload = (await response.json()) as { success: boolean; error?: { message: string } };

      if (!response.ok || !payload.success) {
        const message =
          "error" in payload && payload.error
            ? payload.error.message
            : "Failed to delete users.";
        throw new Error(message);
      }

      setSelectedIds(new Set());
      setPage(1);
      try {
        await onRefresh?.();
      } catch (refreshError) {
        setDeleteError(
          refreshError instanceof Error
            ? `Deleted, but refreshing the list failed: ${refreshError.message}`
            : "Deleted, but refreshing the list failed."
        );
      }
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete users.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-3 py-8 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[min(100%,1800px)]">
          <nav className="mb-2 font-gotham text-xs text-white/45" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/60 transition hover:text-escobets-yellow">
              Control centre
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white/80">Users</span>
          </nav>
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
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                disabled={selectedIds.size === 0 || isDeleting}
                onClick={() => void handleDeleteSelected()}
                className={cn(
                  "rounded-lg border px-4 py-2 font-gotham text-sm transition",
                  selectedIds.size === 0 || isDeleting
                    ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                    : "border-red-500/50 bg-red-950/40 text-red-200 hover:border-red-400/60 hover:bg-red-950/70"
                )}
              >
                {isDeleting
                  ? "Deleting…"
                  : selectedIds.size > 0
                    ? `Delete selected (${selectedIds.size})`
                    : "Delete selected"}
              </button>
            </div>
          </div>

          {deleteError ? (
            <p className="mt-2 font-gotham text-sm text-red-400" role="alert">
              {deleteError}
            </p>
          ) : null}

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
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 [scrollbar-gutter:stable]">
            <table className="w-full min-w-[1024px] border-collapse font-gotham text-xs sm:min-w-[1120px]">
              <thead>
                <tr className="border-b border-white/10 bg-escobets-gray-card/50">
                  <th className="px-2.5 py-2 text-left text-xs font-medium uppercase tracking-wider text-white/70">
                    <div className="flex items-center gap-2">
                      <input
                        ref={selectAllOnPageRef}
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAllOnPage}
                        disabled={paginatedUsers.length === 0}
                        className="h-3.5 w-3.5 shrink-0 border-white/30 accent-escobets-yellow disabled:opacity-40"
                        aria-label="Select all rows on this page"
                      />
                      <span>#</span>
                    </div>
                  </th>
                  <SortableTh
                    label="User name"
                    columnKey="userName"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Telegram"
                    columnKey="telegram"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Phone"
                    columnKey="phone"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Email"
                    columnKey="email"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Status"
                    columnKey="status"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Last update"
                    columnKey="lastUpdate"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Profits"
                    columnKey="profits"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                  <SortableTh
                    label="Losses"
                    columnKey="losses"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortColumn}
                  />
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-2.5 py-2 align-top">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user.id)}
                          onChange={() => toggleRow(user.id)}
                          className="h-3.5 w-3.5 shrink-0 border-white/30 accent-escobets-yellow"
                          aria-label={`Select ${user.userName}`}
                        />
                        <span className="text-white/80">{(page - 1) * rowsPerPage + idx + 1}</span>
                      </div>
                    </td>
                    <td className="max-w-[14rem] px-2.5 py-2 align-top sm:max-w-xs md:max-w-sm lg:max-w-md">
                      <Link
                        href={`/users/${encodeURIComponent(user.id)}/profit-tracker?name=${encodeURIComponent(user.userName)}`}
                        className="line-clamp-2 break-words text-escobets-yellow transition hover:underline"
                      >
                        {user.userName}
                      </Link>
                    </td>
                    <td className="max-w-[9rem] px-2.5 py-2 align-top sm:max-w-[10rem]">
                      <span className="line-clamp-2 break-all text-white/90">{user.telegram}</span>
                    </td>
                    <td className="max-w-[8rem] px-2.5 py-2 align-top">
                      <span className="line-clamp-2 break-words text-white/90">{user.phone}</span>
                    </td>
                    <td className="min-w-[12rem] max-w-[18rem] px-2.5 py-2 align-top sm:min-w-[14rem] sm:max-w-md lg:min-w-[16rem] lg:max-w-lg">
                      <span className="line-clamp-2 break-all text-white/90">{user.email}</span>
                    </td>
                    <td className="px-2.5 py-2 align-top">
                      <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-white/20 bg-black px-2 py-0.5 text-[0.7rem] font-medium leading-tight text-white sm:text-xs">
                        <span
                          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT_COLORS[user.status])}
                          aria-hidden
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-2.5 py-2 align-top text-white/80">
                      <span className="line-clamp-2 break-words">{user.lastUpdate}</span>
                    </td>
                    <td className="px-2.5 py-2 align-top tabular-nums text-escobets-yellow">
                      {formatCurrency(user.profits)}
                    </td>
                    <td className="px-2.5 py-2 align-top tabular-nums text-white/80">
                      {formatCurrency(user.losses)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            role="navigation"
            aria-label="Table pagination"
          >
            <p className="font-gotham text-xs text-white/50 sm:text-sm">
              <span className="text-white/40">Showing </span>
              <span className="tabular-nums text-white/90">
                {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filteredCount)}
              </span>
              <span className="text-white/40"> of </span>
              <span className="tabular-nums text-white/80">{filteredCount}</span>
            </p>
            <div className="flex flex-wrap items-stretch gap-2 sm:items-center sm:gap-3">
              <div className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-xl border border-white/10 bg-escobets-gray-card/80 px-3 py-1.5 pl-3.5 shadow-sm shadow-black/20 backdrop-blur-sm">
                <label
                  htmlFor="rows-per-page"
                  className="shrink-0 font-gotham text-xs text-white/50 sm:text-sm"
                >
                  Rows per page
                </label>
                <div className="relative min-w-[4.5rem]">
                  <select
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-white/15 bg-black/40 py-1 pl-2.5 pr-7 font-gotham text-xs text-white/95 transition hover:border-white/25 focus:border-escobets-yellow/50 focus:outline-none focus:ring-2 focus:ring-escobets-yellow/20 sm:text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40"
                    aria-hidden
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <div className="inline-flex min-h-[2.5rem] items-center overflow-hidden rounded-xl border border-white/10 bg-escobets-gray-card/80 p-0.5 font-gotham shadow-sm shadow-black/20 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 transition",
                    "hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-escobets-yellow/50",
                    "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                </button>
                <div
                  className="flex min-w-[5.5rem] flex-col items-center justify-center px-2 py-0.5 sm:min-w-[6rem] sm:px-3"
                  aria-live="polite"
                >
                  <span className="text-[0.65rem] font-medium uppercase tracking-widest text-white/40">
                    Page
                  </span>
                  <span className="text-sm font-semibold tabular-nums tracking-tight text-white sm:text-base">
                    {page}
                    <span className="font-normal text-white/35"> / </span>
                    {totalPages || 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 transition",
                    "hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-escobets-yellow/50",
                    "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  )}
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
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
