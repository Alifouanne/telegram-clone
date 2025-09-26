"use server";

import { serverClient } from "@/lib/streamServer";

export async function createToken(userId: string) {
  const token = serverClient.createToken(userId);
  console.log("Generated token for userId", userId, token);
  return token;
}
