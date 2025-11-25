import { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Plan limits definition (mirrors src/config/features.js)
const PLAN_LIMITS = {
    basic: {
        maxKeywords: 10,
        maxAudits: 5,
    },
    professional: {
        maxKeywords: 50,
        maxAudits: 20,
    },
    enterprise: {
        maxKeywords: 1000,
        maxAudits: 100,
    }
};

export async function getPlanLimits(ctx: QueryCtx, orgId: Id<"organizations">) {
    const org = await ctx.db.get(orgId);
    if (!org) throw new Error("Organization not found");

    // Default to basic if plan is missing or invalid
    const plan = (org.plan && PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS])
        ? org.plan
        : "basic";

    return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
}

export async function checkLimit(
    ctx: QueryCtx,
    orgId: Id<"organizations">,
    featureKey: keyof typeof PLAN_LIMITS.basic,
    currentUsage: number
) {
    const limits = await getPlanLimits(ctx, orgId);
    const limit = limits[featureKey];

    if (currentUsage >= limit) {
        throw new Error(`Plan limit reached for ${featureKey}. Limit: ${limit}, Current: ${currentUsage}`);
    }

    return true;
}
