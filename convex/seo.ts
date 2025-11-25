import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Mock Data for SEO (same as frontend mock for now)
const MOCK_ON_PAGE_RESULT = {
    meta: {
        title: { value: "Usługi Malarskie Dublin - Malowanie Domów i Biur", length: 45, status: "ok" },
        description: { value: "Profesjonalne malowanie wnętrz i elewacji w Dublinie. Szybkie terminy, darmowa wycena. Zadzwoń: +353 1 234 5678.", length: 110, status: "ok" },
        canonical: "https://dublinpainters.ie",
        h1: ["Profesjonalni Malarze w Dublinie"]
    },
    performance: {
        lcp: 2.4,
        cls: 0.15,
        fid: 120,
        score: 78
    },
    issues: [
        { type: "error", message: "Brak atrybutu alt w 3 obrazkach", severity: "high" },
        { type: "warning", message: "Czas odpowiedzi serwera powyżej 600ms", severity: "medium" },
        { type: "info", message: "Zalecana kompresja zasobów CSS", severity: "low" }
    ],
    technologies: ["WordPress", "jQuery", "Google Analytics"]
};

const MOCK_KEYWORDS = [
    { keyword: "malarz dublin", volume: 1200, cpc: 2.50, difficulty: 45 },
    { keyword: "malowanie mieszkań dublin", volume: 850, cpc: 1.80, difficulty: 30 }
];

// Action: Calls External API (DataForSEO)
export const runAuditAction = action({
    args: { url: v.string(), orgId: v.id("organizations") },
    handler: async (ctx, args) => {
        console.log(`[Action] Starting audit for ${args.url}`);

        const apiKey = process.env.DATAFORSEO_API_KEY;
        if (!apiKey) {
            throw new Error("Missing DATAFORSEO_API_KEY");
        }

        // 1. POST Task
        const postResponse = await fetch("https://api.dataforseo.com/v3/on_page/task_post", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{
                target: args.url,
                max_crawl_pages: 1,
                load_resources: false,
                enable_javascript: false,
                calculate_keyword_density: true
            }])
        });

        const postData = await postResponse.json();
        if (postData.status_code !== 20000) {
            console.error("DataForSEO Error:", postData);
            throw new Error(`DataForSEO API Error: ${postData.status_message}`);
        }

        const taskId = postData.tasks[0].id;
        console.log(`[Action] Task created: ${taskId}`);

        // 2. Poll for results
        let attempts = 0;
        let resultData = null;

        while (attempts < 30) { // Max 60-90 seconds
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s

            const getResponse = await fetch(`https://api.dataforseo.com/v3/on_page/summary/${taskId}`, {
                headers: { "Authorization": `Basic ${apiKey}` }
            });

            const getData = await getResponse.json();

            if (getData.tasks && getData.tasks[0] && getData.tasks[0].result && getData.tasks[0].result.length > 0) {
                const taskResult = getData.tasks[0].result[0];

                if (taskResult.crawl_progress === "finished") {
                    resultData = taskResult;
                    break;
                }
            }
            attempts++;
        }

        if (!resultData) {
            throw new Error("Audit timed out or failed");
        }

        // 3. Transform Data
        const pageMetrics = resultData.page_metrics || {};
        const onPageScore = pageMetrics.onpage_score || 0;

        // Fetch detailed page info for meta tags AND keyword density
        const pagesResponse = await fetch(`https://api.dataforseo.com/v3/on_page/pages`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{
                id: taskId,
                limit: 1
            }])
        });
        const pagesData = await pagesResponse.json();
        const pageDetails = pagesData.tasks[0].result[0].items[0];

        // 4. Fetch Keyword Suggestions using Keywords For Site
        let keywords = [];

        const isPl = args.url.includes(".pl");
        const locationCode = isPl ? 2616 : 2372; // Poland vs Ireland
        const languageCode = isPl ? "pl" : "en";

        console.log(`[Action] Fetching keywords for site: ${args.url} (Loc: ${locationCode}, Lang: ${languageCode})`);

        try {
            const keywordsResponse = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/live", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([{
                    target: args.url,
                    location_code: locationCode,
                    language_code: languageCode,
                    include_adult_keywords: false,
                    limit: 10,
                    sort_by: "search_volume" // Get highest volume keywords
                }])
            });

            const keywordsData = await keywordsResponse.json();
            console.log(`[Action] Keywords API Status: ${keywordsData.status_code}`);

            if (keywordsData.tasks && keywordsData.tasks[0] && keywordsData.tasks[0].result) {
                keywords = keywordsData.tasks[0].result.map((item: any) => ({
                    keyword: item.keyword,
                    volume: item.search_volume || 0,
                    cpc: item.cpc || 0,
                    difficulty: item.competition_index || 0
                }));
                console.log(`[Action] Found ${keywords.length} keywords`);
            } else {
                console.log(`[Action] No keywords found in response`, JSON.stringify(keywordsData));
                // Fallback: If keywords_for_site fails, maybe try keyword_ideas with Title as backup?
                // For now, let's stick to this as it's the most direct method.
            }
        } catch (e) {
            console.error("Failed to fetch keywords:", e);
        }


        const result = {
            audit_time: new Date().toISOString(),
            on_page: {
                meta: {
                    title: {
                        value: pageDetails.meta.title || "",
                        length: (pageDetails.meta.title || "").length,
                        status: pageDetails.meta.title ? "ok" : "error"
                    },
                    description: {
                        value: pageDetails.meta.description || "",
                        length: (pageDetails.meta.description || "").length,
                        status: pageDetails.meta.description ? "ok" : "error"
                    },
                    canonical: pageDetails.meta.canonical || "",
                    h1: [pageDetails.meta.h1 || ""]
                },
                performance: {
                    lcp: (pageDetails.page_timing?.dom_content_loaded_time || 0) / 1000, // Approx
                    cls: pageDetails.meta.cumulative_layout_shift || 0,
                    fid: pageDetails.page_timing?.waiting_time || 0,
                    score: Math.round(onPageScore)
                },
                issues: mapIssues(resultData),
                technologies: ["Server: " + (pageDetails.meta.server || "Unknown")]
            },
            keywords: keywords
        };

        // Save result to DB via mutation
        await ctx.runMutation(api.seo.saveAuditResult, {
            orgId: args.orgId,
            url: args.url,
            fullResult: result,
            score: result.on_page.performance.score,
            metaTitle: result.on_page.meta.title.value
        });

        return result;
    },
});

function mapIssues(data: any) {
    const issues = [];
    // Example mapping - DataForSEO structure is complex, simplifying for now
    if (data.checks) {
        if (data.checks.duplicate_title > 0) issues.push({ type: "error", message: "Duplicate Title", severity: "high" });
        if (data.checks.duplicate_description > 0) issues.push({ type: "error", message: "Duplicate Description", severity: "high" });
        if (data.checks.broken_links > 0) issues.push({ type: "error", message: "Broken Links Found", severity: "high" });
        if (data.checks.is_https === false) issues.push({ type: "warning", message: "No HTTPS", severity: "high" });
    }
    return issues;
}

// Mutation: Saves audit result to DB
export const saveAuditResult = mutation({
    args: {
        orgId: v.id("organizations"),
        url: v.string(),
        fullResult: v.any(),
        score: v.number(),
        metaTitle: v.string()
    },
    handler: async (ctx, args) => {
        // Check if audit exists to update or create new
        const existing = await ctx.db
            .query("seoAudits")
            .withIndex("by_org_url", (q) => q.eq("orgId", args.orgId).eq("url", args.url))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: "completed",
                fullResult: args.fullResult,
                score: args.score,
                metaTitle: args.metaTitle,
                createdAt: Date.now()
            });
        } else {
            await ctx.db.insert("seoAudits", {
                orgId: args.orgId,
                url: args.url,
                status: "completed",
                fullResult: args.fullResult,
                score: args.score,
                metaTitle: args.metaTitle,
                createdAt: Date.now()
            });
        }
    },
});

// Query: Get audit from cache
export const getAudit = query({
    args: { url: v.string(), orgId: v.id("organizations") },
    handler: async (ctx, args) => {
        const audit = await ctx.db
            .query("seoAudits")
            .withIndex("by_org_url", (q) => q.eq("orgId", args.orgId).eq("url", args.url))
            .first();

        return audit;
    },
});
