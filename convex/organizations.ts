import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Get current organization (Mocked for single tenant dev)
export const getCurrent = query({
    args: {},
    handler: async (ctx) => {
        // For dev, just return the first organization found
        const org = await ctx.db.query("organizations").first();
        return org;
    },
});

// Mutation: Create initial organization (for setup)
export const createDevOrg = mutation({
    args: { name: v.string(), slug: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("organizations")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existing) return existing._id;

        const orgId = await ctx.db.insert("organizations", {
            name: args.name,
            slug: args.slug,
            plan: "professional", // Default to pro for dev
            subscriptionStatus: "active",
            settings: {
                timezone: "Europe/Dublin",
                language: "en"
            }
        });

        return orgId;
    },
});

export const updateWebsiteUrl = mutation({
    args: { orgId: v.id("organizations"), url: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orgId, {
            website: args.url
        });
    }
});

export const updateSettings = mutation({
    args: {
        orgId: v.id("organizations"),
        businessProfile: v.optional(v.object({
            placeId: v.optional(v.string()),
            cid: v.optional(v.string()),
            isConnected: v.optional(v.boolean()),
        })),
        gridSettings: v.optional(v.object({
            maxSize: v.number(),
            stepKm: v.number(),
            centerName: v.string(),
            centerLat: v.optional(v.number()),
            centerLng: v.optional(v.number()),
        })),
        featureFlags: v.optional(v.object({
            autoReply: v.boolean(),
            photoMonitoring: v.boolean(),
            postPublishing: v.boolean(),
            dataProtection: v.boolean(),
            qaMonitoring: v.boolean(),
            hoursSync: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const updateData: any = {};
        if (args.businessProfile) updateData.businessProfile = args.businessProfile;
        if (args.gridSettings) updateData.gridSettings = args.gridSettings;
        if (args.featureFlags) updateData.featureFlags = args.featureFlags;

        await ctx.db.patch(args.orgId, updateData);
    }
});
