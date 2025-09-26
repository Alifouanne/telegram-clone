import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const getUserByClerkId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;

    return await ctx.db
      .query("users")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();
  },
});

//create or update user
export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, imageUrl });
      return existingUser._id;
    }
    return await ctx.db.insert("users", { userId, name, email, imageUrl });
  },
});

//search users by name or email

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) return [];
    const normalizedSearch = searchTerm.toLowerCase().trim();

    const allUsers = await ctx.db.query("users").collect();

    return allUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 20);
  },
});
