"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/users?page=1&pageSize=500", {
          signal: controller.signal,
        });
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
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error ? fetchError.message : "Failed to load users."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

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

  return <UsersView users={users} />;
}
