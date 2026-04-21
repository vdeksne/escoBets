"use client";

import { useCallback, useEffect, useState } from "react";
import { UsersView } from "@/components/admin/users-view";
import type { AdminUser } from "@/types/user";
import type { ApiResponse } from "@/types/api";

interface UsersData {
  items: AdminUser[];
}

/** Admin users dashboard – backend: replace MOCK_ADMIN_USERS with API/Supabase */
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (options?: { signal?: AbortSignal; silent?: boolean }) => {
    const { signal, silent } = options ?? {};
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const response = await fetch("/api/users?page=1&pageSize=500", { signal });
      const payload = (await response.json()) as ApiResponse<UsersData>;

      if (!response.ok || !payload.success) {
        const message =
          payload.success === false
            ? payload.error.message
            : "Failed to load users.";
        throw new Error(message);
      }

      setUsers(payload.data.items);
    } catch (fetchError) {
      if (signal?.aborted) return;
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to load users.";
      if (!silent) {
        setError(message);
      } else {
        throw fetchError instanceof Error ? fetchError : new Error(message);
      }
    } finally {
      if (!silent && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadUsers({ signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [loadUsers]);

  const handleRefreshUsers = useCallback(async () => {
    await loadUsers({ silent: true });
  }, [loadUsers]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-white/70">Loading users...</p>
      </div>
    );
  }

  return <UsersView users={users} onRefresh={handleRefreshUsers} />;
}
