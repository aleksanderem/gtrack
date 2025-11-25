import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

// Mock data removed as it is now handled by backend

export const SeoService = {
  /**
   * Triggers an On-Page Audit task via Convex Action
   * @param {string} url Target URL
   */
  async runAudit(url) {
    console.log(`[SeoService] Requesting audit for ${url}...`);

    // 1. Get current org (TODO: Get from auth context)
    const org = await convex.query(api.organizations.getCurrent);
    if (!org) throw new Error("No organization found");

    // 2. Check cache first
    const cached = await convex.query(api.seo.getAudit, {
      url,
      orgId: org._id
    });

    if (cached && cached.status === 'completed' && (Date.now() - cached.createdAt < 1000 * 60 * 60 * 24)) {
      console.log(`[SeoService] Returning cached result`);
      return {
        ...cached.fullResult,
        _fromCache: true
      };
    }

    // 3. Run action (calls DataForSEO)
    const result = await convex.action(api.seo.runAuditAction, {
      url,
      orgId: org._id
    });

    return result;
  },

  /**
   * Fetches keyword suggestions
   * @param {string} seedKeyword 
   */
  async getKeywordSuggestions(seedKeyword) {
    // TODO: Implement keyword action in Convex
    console.log(`[SeoService] Fetching keywords for ${seedKeyword}...`);
    return [
      { keyword: seedKeyword + " dublin", volume: 1200, cpc: 2.50, difficulty: 45 },
      { keyword: "best " + seedKeyword, volume: 850, cpc: 1.80, difficulty: 30 }
    ];
  }
};

