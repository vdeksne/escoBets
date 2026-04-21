#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

function usage() {
  console.log(
    [
      "Usage:",
      "  npm run admin:make -- <email> [password]",
      "",
      "Examples:",
      "  npm run admin:make -- admin@escobets.com",
      "  npm run admin:make -- admin@escobets.com StrongPass123!",
      "",
      "Behavior:",
      "  - If user exists: promotes to admin",
      "  - If user does not exist and password is provided: creates confirmed admin user",
      "  - If user does not exist and password is missing: exits with guidance",
    ].join("\n"),
  );
}

function normalizeRoles(input) {
  if (!Array.isArray(input)) return [];
  return input.filter((value) => typeof value === "string");
}

function withAdminMetadata(existing = {}) {
  const roles = new Set(normalizeRoles(existing.roles));
  roles.add("admin");
  return {
    ...existing,
    role: "admin",
    roles: Array.from(roles),
  };
}

async function listAllUsers(admin) {
  const users = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const batch = data?.users ?? [];
    users.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const emailArg = process.argv[2]?.trim().toLowerCase();
  const passwordArg = process.argv[3];

  if (!emailArg || !emailArg.includes("@")) {
    usage();
    process.exit(1);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    );
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const users = await listAllUsers(admin);
  const existing = users.find((user) => user.email?.toLowerCase() === emailArg);

  if (existing) {
    const nextAppMeta = withAdminMetadata(existing.app_metadata ?? {});
    const nextUserMeta = withAdminMetadata(existing.user_metadata ?? {});
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      app_metadata: nextAppMeta,
      user_metadata: nextUserMeta,
    });
    if (error) throw error;
    console.log(`Promoted existing user to admin: ${emailArg}`);
    return;
  }

  if (!passwordArg) {
    console.error(
      `User ${emailArg} not found. Provide a password to create the user:\n` +
        `  npm run admin:make -- ${emailArg} "StrongPass123!"`,
    );
    process.exit(1);
  }

  const { error } = await admin.auth.admin.createUser({
    email: emailArg,
    password: passwordArg,
    email_confirm: true,
    app_metadata: withAdminMetadata(),
    user_metadata: withAdminMetadata(),
  });

  if (error) throw error;
  console.log(`Created and promoted admin user: ${emailArg}`);
}

main().catch((error) => {
  console.error("Failed to create/promote admin user.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
