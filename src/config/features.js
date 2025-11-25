// Central feature configuration
// Defines plans, hierarchy, and feature availability/limits

export const PLANS = {
    BASIC: 'basic',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise'
};

export const PLAN_LEVELS = {
    [PLANS.BASIC]: 1,
    [PLANS.PROFESSIONAL]: 2,
    [PLANS.ENTERPRISE]: 3
};

export const PLAN_NAMES = {
    [PLANS.BASIC]: 'Basic',
    [PLANS.PROFESSIONAL]: 'Professional',
    [PLANS.ENTERPRISE]: 'Enterprise'
};

// Feature definitions
// Each feature has:
// - id: unique key
// - label: display name
// - requiredPlan: minimum plan level required
// - description: user-facing description
// - limits: optional quotas per plan
export const FEATURES = {
    // REVIEWS MODULE
    reviews: {
        id: 'reviews',
        label: 'Opinie',
        requiredPlan: PLANS.BASIC,
        description: 'Zarządzanie opiniami klientów',
        icon: 'pi pi-comments'
    },
    viewReviews: {
        id: 'viewReviews',
        parentId: 'reviews',
        label: 'Przeglądanie opinii',
        requiredPlan: PLANS.BASIC,
        description: 'Wyświetlanie i filtrowanie opinii',
        icon: 'pi pi-eye',
        limits: {
            maxReviewsPerPage: { [PLANS.BASIC]: 10, [PLANS.PROFESSIONAL]: 50, [PLANS.ENTERPRISE]: 999 }
        }
    },
    templates: {
        id: 'templates',
        parentId: 'reviews',
        label: 'Szablony odpowiedzi',
        requiredPlan: PLANS.BASIC,
        description: 'Tworzenie i zarządzanie szablonami odpowiedzi',
        icon: 'pi pi-list',
        limits: {
            maxTemplates: { [PLANS.BASIC]: 5, [PLANS.PROFESSIONAL]: 50, [PLANS.ENTERPRISE]: 999 }
        }
    },
    aiAnalysis: {
        id: 'aiAnalysis',
        parentId: 'reviews',
        label: 'Wnioski AI',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Analiza sentymentu i powtarzających się tematów',
        icon: 'pi pi-sparkles',
        limits: {
            maxAnalysisPerMonth: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 100, [PLANS.ENTERPRISE]: 999 }
        }
    },
    autoReply: {
        id: 'autoReply',
        parentId: 'reviews',
        label: 'Auto-odpowiedzi',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Automatyczne odpowiadanie na opinie',
        icon: 'pi pi-bolt',
        limits: {
            maxAutoRepliesPerMonth: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 50, [PLANS.ENTERPRISE]: 999 },
            maxRules: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 5, [PLANS.ENTERPRISE]: 20 }
        }
    },
    interceptedReviews: {
        id: 'interceptedReviews',
        parentId: 'reviews',
        label: 'Przechwycone opinie',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Monitorowanie opinii przed publikacją',
        icon: 'pi pi-inbox',
        limits: {
            maxInterceptedPerMonth: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 100, [PLANS.ENTERPRISE]: 999 }
        }
    },
    acquisition: {
        id: 'acquisition',
        parentId: 'reviews',
        label: 'Pozyskiwanie opinii',
        requiredPlan: PLANS.BASIC,
        description: 'Narzędzia do pozyskiwania nowych opinii',
        icon: 'pi pi-megaphone',
        limits: {
            maxCampaigns: { [PLANS.BASIC]: 1, [PLANS.PROFESSIONAL]: 10, [PLANS.ENTERPRISE]: 999 }
        }
    },

    // MAP MODULE
    map: {
        id: 'map',
        label: 'Mapa',
        requiredPlan: PLANS.BASIC,
        description: 'Mapa Google z pozycją firmy i konkurencji',
        icon: 'pi pi-map'
    },

    // KEYWORDS MODULE  
    keywords: {
        id: 'keywords',
        label: 'Słowa kluczowe',
        requiredPlan: PLANS.BASIC,
        description: 'Monitorowanie pozycji w wyszukiwarkach',
        icon: 'pi pi-list',
        limits: {
            maxKeywords: { [PLANS.BASIC]: 2, [PLANS.PROFESSIONAL]: 50, [PLANS.ENTERPRISE]: 200 }
        }
    },
    keywordTracking: {
        id: 'keywordTracking',
        parentId: 'keywords',
        label: 'Śledzenie pozycji',
        requiredPlan: PLANS.BASIC,
        description: 'Automatyczne sprawdzanie pozycji słów kluczowych',
        icon: 'pi pi-chart-line'
    },
    keywordReports: {
        id: 'keywordReports',
        parentId: 'keywords',
        label: 'Raporty pozycji',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Zaawansowane raporty ze zmianami pozycji',
        icon: 'pi pi-file-pdf'
    },
    keywordGridSettings: {
        id: 'keywordGridSettings',
        parentId: 'keywords',
        label: 'Ustawienia siatki',
        requiredPlan: PLANS.BASIC,
        description: 'Konfiguracja siatki wyszukiwania dla słów kluczowych',
        icon: 'pi pi-table',
        limits: {
            // Maksymalna liczba punktów w siatce (9 dla 3x3, 36 dla 6x6, 81 dla 9x9)
            maxGridPoints: { [PLANS.BASIC]: 25, [PLANS.PROFESSIONAL]: 100, [PLANS.ENTERPRISE]: 500 },
            // Maksymalny odstęp między punktami w metrach (większy = większy obszar)
            maxStepMeters: { [PLANS.BASIC]: 1000, [PLANS.PROFESSIONAL]: 1500, [PLANS.ENTERPRISE]: 2000 }
        }
    },
    keywordScanningSchedule: {
        id: 'keywordScanningSchedule',
        parentId: 'keywords',
        label: 'Harmonogram skanowania',
        requiredPlan: PLANS.BASIC,
        description: 'Częstotliwość automatycznego sprawdzania pozycji',
        icon: 'pi pi-clock',
        // Dostępne częstotliwości skanowania dla każdego pakietu
        availableFrequencies: {
            [PLANS.BASIC]: ['monthly', 'biweekly', 'weekly', 'manual'],
            [PLANS.PROFESSIONAL]: ['monthly', 'biweekly', 'weekly', 'daily', 'manual'],
            [PLANS.ENTERPRISE]: ['monthly', 'biweekly', 'weekly', 'daily', 'hourly', 'manual']
        },
        // Legacy limits for Debug Bar (not used in components)
        limits: {
            minScanIntervalHours: { [PLANS.BASIC]: 168, [PLANS.PROFESSIONAL]: 24, [PLANS.ENTERPRISE]: 1 }
        }
    },

    // COMPARISON MODULE
    comparison: {
        id: 'comparison',
        label: 'Konkurencja',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Analiza i porównanie z konkurencją',
        icon: 'pi pi-users',
        limits: {
            maxCompetitors: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 5, [PLANS.ENTERPRISE]: 20 }
        }
    },
    competitorTracking: {
        id: 'competitorTracking',
        parentId: 'comparison',
        label: 'Śledzenie konkurencji',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Monitorowanie profili konkurencyjnych firm',
        icon: 'pi pi-eye'
    },
    competitorReports: {
        id: 'competitorReports',
        parentId: 'comparison',
        label: 'Raporty porównawcze',
        requiredPlan: PLANS.ENTERPRISE,
        description: 'Szczegółowe raporty z analizą konkurencji',
        icon: 'pi pi-chart-bar'
    },

    // CONTENT MODULE
    content: {
        id: 'content',
        label: 'Wizytówka',
        requiredPlan: PLANS.BASIC,
        description: 'Zarządzanie zawartością profilu Google',
        icon: 'pi pi-id-card'
    },
    contentEditing: {
        id: 'contentEditing',
        parentId: 'content',
        label: 'Edycja wizytówki',
        requiredPlan: PLANS.BASIC,
        description: 'Aktualizacja informacji o firmie',
        icon: 'pi pi-pencil'
    },
    bulkContentUpdate: {
        id: 'bulkContentUpdate',
        parentId: 'content',
        label: 'Masowa aktualizacja',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Aktualizacja wielu lokalizacji jednocześnie',
        icon: 'pi pi-sync'
    },

    // SETTINGS MODULE
    settings: {
        id: 'settings',
        label: 'Ustawienia',
        requiredPlan: PLANS.BASIC,
        description: 'Ustawienia aplikacji i konta',
        icon: 'pi pi-cog'
    },

    // OTHER MODULES
    photoMonitoring: {
        id: 'photoMonitoring',
        label: 'Monitoring zdjęć',
        requiredPlan: PLANS.BASIC,
        description: 'Powiadomienia o nowych zdjęciach od klientów',
        icon: 'pi pi-images',
        limits: {
            maxPhotosPerMonth: { [PLANS.BASIC]: 50, [PLANS.PROFESSIONAL]: 500, [PLANS.ENTERPRISE]: 9999 }
        }
    },
    postPublishing: {
        id: 'postPublishing',
        label: 'Publikacja postów',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Planowanie i publikacja postów na profilu firmy',
        icon: 'pi pi-calendar',
        limits: {
            maxScheduledPosts: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 30, [PLANS.ENTERPRISE]: 999 }
        }
    },
    scheduleSettings: {
        id: 'scheduleSettings',
        label: 'Ustawienia harmonogramów',
        requiredPlan: PLANS.BASIC,
        description: 'Konfiguracja częstotliwości automatycznych zadań',
        icon: 'pi pi-calendar-clock',
        limits: {
            // Częstotliwość synchronizacji danych (w minutach)
            minDataSyncIntervalMinutes: { [PLANS.BASIC]: 60, [PLANS.PROFESSIONAL]: 15, [PLANS.ENTERPRISE]: 5 },
            // Częstotliwość sprawdzania opinii (w minutach)
            minReviewCheckIntervalMinutes: { [PLANS.BASIC]: 30, [PLANS.PROFESSIONAL]: 10, [PLANS.ENTERPRISE]: 5 },
            // Częstotliwość aktualizacji zdjęć (w godzinach)
            minPhotoUpdateIntervalHours: { [PLANS.BASIC]: 24, [PLANS.PROFESSIONAL]: 6, [PLANS.ENTERPRISE]: 1 },
            // Maksymalna liczba równoległych zadań
            maxConcurrentTasks: { [PLANS.BASIC]: 2, [PLANS.PROFESSIONAL]: 5, [PLANS.ENTERPRISE]: 20 }
        }
    },
    dataProtection: {
        id: 'dataProtection',
        label: 'Ochrona danych',
        requiredPlan: PLANS.BASIC,
        description: 'Blokowanie nieautoryzowanych zmian w wizytówce',
        icon: 'pi pi-shield'
    },
    qaMonitoring: {
        id: 'qaMonitoring',
        label: 'Monitoring Q&A',
        requiredPlan: PLANS.PROFESSIONAL,
        description: 'Powiadomienia o pytaniach i sugestie odpowiedzi AI',
        icon: 'pi pi-question-circle',
        limits: {
            maxQuestionsPerMonth: { [PLANS.BASIC]: 0, [PLANS.PROFESSIONAL]: 100, [PLANS.ENTERPRISE]: 999 }
        }
    },
    hoursSync: {
        id: 'hoursSync',
        label: 'Godziny otwarcia',
        requiredPlan: PLANS.ENTERPRISE,
        description: 'Automatyczna aktualizacja godzin w dni świąteczne',
        icon: 'pi pi-clock'
    }
};

// Helper to get hierarchy if needed for UI
export const getFeatureHierarchy = () => {
    const rootFeatures = Object.values(FEATURES).filter(f => !f.parentId);

    return rootFeatures.map(root => {
        const children = Object.values(FEATURES)
            .filter(f => f.parentId === root.id)
            .reduce((acc, child) => {
                acc[child.id] = child;
                return acc;
            }, {});

        return {
            ...root,
            children: Object.keys(children).length > 0 ? children : undefined
        };
    });
};
