import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Gamification fields
    xp: v.optional(v.number()),
    level: v.optional(v.number()),
    prestigeLevel: v.optional(v.number()),
    timezone: v.optional(v.string()),
    lastDailyReset: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    type: v.union(v.literal("daily"), v.literal("persistent")),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    isArchived: v.boolean(),
    reminderTime: v.optional(v.number()),
    reminderFired: v.optional(v.boolean()),
    createdAt: v.number(),
    order: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_type", ["userId", "type"])
    .index("userId_type_isArchived", ["userId", "type", "isArchived"])
    .index("userId_reminder", ["userId", "reminderTime"])
    .index("type_isArchived", ["type", "isArchived"]),
});

export default schema;
