"use server";

import { serverClient } from "@/lib/streamServer";

export async function ensureStreamUsers(memberIds: string[]) {
  if (!Array.isArray(memberIds) || memberIds.length === 0) return { ok: true };

  // Deduplicate and sanitize IDs
  const uniqueIds = Array.from(new Set(memberIds.filter(Boolean)));
  if (uniqueIds.length === 0) return { ok: true };

  // Stream requires users to exist before channel creation
  // We upsert minimal user objects (id only).
  const users = uniqueIds.map((id) => ({ id }));

  await serverClient.upsertUsers(users);

  return { ok: true };
}
