
// Mock data for SEO Audit
const MOCK_ON_PAGE_RESULT = {
  meta: {
    title: { value: "Usługi Malarskie Dublin - Malowanie Domów i Biur", length: 45, status: "ok" },
    description: { value: "Profesjonalne malowanie wnętrz i elewacji w Dublinie. Szybkie terminy, darmowa wycena. Zadzwoń: +353 1 234 5678.", length: 110, status: "ok" },
    canonical: "https://dublinpainters.ie",
    h1: ["Profesjonalni Malarze w Dublinie"]
  },
  performance: {
    lcp: 2.4, // Largest Contentful Paint (s)
    cls: 0.15, // Cumulative Layout Shift
    fid: 120, // First Input Delay (ms)
    score: 78 // Overall score
  },
  issues: [
    { type: "error", message: "Brak atrybutu alt w 3 obrazkach", severity: "high" },
    { type: "warning", message: "Czas odpowiedzi serwera powyżej 600ms", severity: "medium" },
    { type: "info", message: "Zalecana kompresja zasobów CSS", severity: "low" }
  ],
  technologies: ["WordPress", "jQuery", "Google Analytics"]
};

const MOCK_KEYWORD_SUGGESTIONS = [
  { keyword: "malarz dublin", volume: 1200, cpc: 2.50, difficulty: 45 },
  { keyword: "malowanie mieszkań dublin", volume: 850, cpc: 1.80, difficulty: 30 },
  { keyword: "usługi remontowe dublin", volume: 600, cpc: 3.20, difficulty: 55 },
  { keyword: "painters dublin", volume: 5400, cpc: 4.50, difficulty: 70 },
  { keyword: "painting services", volume: 2100, cpc: 3.80, difficulty: 60 },
  { keyword: "home decor dublin", volume: 1500, cpc: 1.20, difficulty: 25 }
];

// Helper for simulation delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const SeoService = {
  /**
   * Simulates triggering an On-Page Audit task via DataForSEO API
   * @param {string} url Target URL
   */
  async runAudit(url) {
    console.log(`[SeoService] Starting audit for ${url}...`);
    await delay(2000); // Simulate API request time
    
    // Return mock results
    return {
      url: url,
      audit_time: new Date().toISOString(),
      on_page: MOCK_ON_PAGE_RESULT,
      keywords: MOCK_KEYWORD_SUGGESTIONS
    };
  },

  /**
   * Simulates fetching keyword suggestions
   * @param {string} seedKeyword 
   */
  async getKeywordSuggestions(seedKeyword) {
    console.log(`[SeoService] Fetching keywords for ${seedKeyword}...`);
    await delay(1500);
    return MOCK_KEYWORD_SUGGESTIONS;
  }
};

