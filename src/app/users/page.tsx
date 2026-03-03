"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Users } from "lucide-react";

/** Placeholder – backend: team/users list (admin) */
const MOCK_USERS = [
  { id: "1", name: "User 1", role: "Subscriber", joined: "2026-02-20" },
  { id: "2", name: "User 2", role: "Subscriber", joined: "2026-02-18" },
  { id: "3", name: "User 3", role: "Subscriber", joined: "2026-02-15" },
];

export default function UsersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-gotham text-2xl font-bold text-white">Users</h1>
          <p className="mt-2 font-gotham text-sm text-white/60">
            Backend: Admin list from Supabase auth.
          </p>
          <div className="mt-6 space-y-3">
            {MOCK_USERS.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-white/40" />
                  <div>
                    <p className="font-gotham font-medium text-white">{user.name}</p>
                    <p className="font-gotham text-xs text-white/60">{user.role} · {user.joined}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
