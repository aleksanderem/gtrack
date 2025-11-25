import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkLimit } from "./featureLimits";

async function getCurrentOrgId(ctx: any) {
    const org = await ctx.db.query("organizations").first();
    if (!org) throw new Error("No organization found");
    return org._id;
}

export const getKeywords = query({
    args: {},
    handler: async (ctx) => {
        const orgId = await getCurrentOrgId(ctx);
        return await ctx.db
            .query("keywords")
            .withIndex("by_org", (q) => q.eq("orgId", orgId))
            .collect();
    },
});

export const addKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => {
        const orgId = await getCurrentOrgId(ctx);

        // 1. Check if keyword already exists
        const existing = await ctx.db
            .query("keywords")
            .withIndex("by_org_keyword", (q) => q.eq("orgId", orgId).eq("keyword", args.keyword))
            .first();

        if (existing) return; // Already exists

        // 2. Check limits
        const currentCount = (await ctx.db
            .query("keywords")
            .withIndex("by_org", (q) => q.eq("orgId", orgId))
            .collect()).length;

        await checkLimit(ctx, orgId, "maxKeywords", currentCount);

        // 3. Insert
        await ctx.db.insert("keywords", {
            orgId: orgId,
            keyword: args.keyword,
            createdAt: Date.now(),
        });
    },
});

export const removeKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => {
        const orgId = await getCurrentOrgId(ctx);

        const existing = await ctx.db
            .query("keywords")
            .withIndex("by_org_keyword", (q) => q.eq("orgId", orgId).eq("keyword", args.keyword))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});
