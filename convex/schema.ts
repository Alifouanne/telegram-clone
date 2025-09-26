import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  })
    .index("byUserId", ["userId"])
    .index("byEmail", ["email"]),
});
