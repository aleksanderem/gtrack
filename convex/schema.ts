import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // 1. ORGANIZACJE (Tenants)
    organizations: defineTable({
        name: v.string(),
        slug: v.string(), // np. 'dublin-painters'
        website: v.optional(v.string()), // Added website field
        plan: v.union(v.literal("basic"), v.literal("professional"), v.literal("enterprise")),
        subscriptionStatus: v.string(), // 'active', 'trial', 'past_due'
        stripeCustomerId: v.optional(v.string()),
        // Globalne ustawienia dla organizacji
        settings: v.object({
            timezone: v.string(),
            language: v.string(),
        }),
        // Business Profile (Google Maps)
        businessProfile: v.optional(v.object({
            placeId: v.optional(v.string()),
            cid: v.optional(v.string()),
            isConnected: v.optional(v.boolean()),
        })),
        // Grid Configuration
        gridSettings: v.optional(v.object({
            maxSize: v.number(),
            stepKm: v.number(),
            centerName: v.string(),
            centerLat: v.optional(v.number()),
            centerLng: v.optional(v.number()),
        })),
        // Feature Flags
        featureFlags: v.optional(v.object({
            autoReply: v.boolean(),
            photoMonitoring: v.boolean(),
            postPublishing: v.boolean(),
            dataProtection: v.boolean(),
            qaMonitoring: v.boolean(),
            hoursSync: v.boolean(),
        })),
    }).index("by_slug", ["slug"]),

    // 2. UŻYTKOWNICY (powiązani z organizacją)
    users: defineTable({
        tokenIdentifier: v.string(), // Auth0 / Clerk ID
        name: v.string(),
        email: v.string(),
        orgId: v.id("organizations"),
        role: v.union(v.literal("admin"), v.literal("member")),
    }).index("by_token", ["tokenIdentifier"])
        .index("by_org", ["orgId"]),

    // 3. UŻYCIE FUNKCJI (Feature Usage Tracking)
    featureUsage: defineTable({
        orgId: v.id("organizations"),
        featureKey: v.string(), // np. 'seo_audits', 'keywords_tracked'
        periodStart: v.number(), // timestamp początku miesiąca
        count: v.number(),
        limitSnapshot: v.number(), // jaki był limit w momencie zapisu
    }).index("by_org_period", ["orgId", "periodStart"]),

    // 4. SEO AUDYTY (Cache + Historia)
    seoAudits: defineTable({
        orgId: v.id("organizations"),
        url: v.string(),
        status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
        dataForSeoTaskId: v.optional(v.string()),

        // Wyniki (zdenormalizowane dla szybkiego odczytu)
        score: v.optional(v.number()),
        metaTitle: v.optional(v.string()),

        // Pełny JSON z wynikiem
        fullResult: v.optional(v.any()),

        createdAt: v.number(),
    }).index("by_org_url", ["orgId", "url"])
        .index("by_org_date", ["orgId", "createdAt"]),

    // 5. KEYWORDS (Monitorowane frazy)
    keywords: defineTable({
        orgId: v.id("organizations"),
        keyword: v.string(),
        createdAt: v.number(),
    }).index("by_org", ["orgId"])
        .index("by_org_keyword", ["orgId", "keyword"]),
});
