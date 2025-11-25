// Hierarchical feature structure with sub-features and limits
export const FEATURE_HIERARCHY = {
  reviews: {
    id: 'reviews',
    key: 'reviews',
    label: 'Opinie',
    icon: 'pi pi-comments',
    requiredPlan: 'basic',
    planName: 'Basic',
    description: 'Zarządzanie opiniami klientów',
    enabled: true,
    children: {
      viewReviews: {
        id: 'viewReviews',
        key: 'viewReviews',
        label: 'Przeglądanie opinii',
        icon: 'pi pi-eye',
        requiredPlan: 'basic',
        planName: 'Basic',
        description: 'Wyświetlanie i filtrowanie opinii',
        enabled: true,
        limits: {
          maxReviewsPerPage: { basic: 10, professional: 50, enterprise: 999 }
        }
      },
      templates: {
        id: 'templates',
        key: 'templates',
        label: 'Szablony odpowiedzi',
        icon: 'pi pi-list',
        requiredPlan: 'basic',
        planName: 'Basic',
        description: 'Tworzenie i zarządzanie szablonami odpowiedzi',
        enabled: true,
        limits: {
          maxTemplates: { basic: 5, professional: 50, enterprise: 999 }
        }
      },
      aiAnalysis: {
        id: 'aiAnalysis',
        key: 'aiAnalysis',
        label: 'Wnioski AI',
        icon: 'pi pi-sparkles',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Analiza sentymentu i powtarzających się tematów',
        enabled: false,
        limits: {
          maxAnalysisPerMonth: { professional: 100, enterprise: 999 }
        }
      },
      autoReply: {
        id: 'autoReply',
        key: 'autoReply',
        label: 'Auto-odpowiedzi',
        icon: 'pi pi-bolt',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Automatyczne odpowiadanie na opinie',
        enabled: false,
        limits: {
          maxAutoRepliesPerMonth: { professional: 50, enterprise: 999 },
          maxRules: { professional: 5, enterprise: 20 }
        }
      },
      interceptedReviews: {
        id: 'interceptedReviews',
        key: 'interceptedReviews',
        label: 'Przechwycone opinie',
        icon: 'pi pi-inbox',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Monitorowanie opinii przed publikacją',
        enabled: false,
        limits: {
          maxInterceptedPerMonth: { professional: 100, enterprise: 999 }
        }
      },
      acquisition: {
        id: 'acquisition',
        key: 'acquisition',
        label: 'Pozyskiwanie opinii',
        icon: 'pi pi-megaphone',
        requiredPlan: 'basic',
        planName: 'Basic',
        description: 'Narzędzia do pozyskiwania nowych opinii',
        enabled: true,
        limits: {
          maxCampaigns: { basic: 1, professional: 10, enterprise: 999 }
        }
      }
    }
  },
  autoReply: {
    id: 'autoReply',
    key: 'autoReply',
    label: 'Auto-odpowiedzi',
    icon: 'pi pi-comments',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Automatyczne odpowiadanie na opinie klientów',
    enabled: false,
    children: {
      rules: {
        id: 'autoReplyRules',
        key: 'autoReplyRules',
        label: 'Reguły auto-odpowiedzi',
        icon: 'pi pi-sliders-h',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Konfiguracja reguł automatycznego odpowiadania',
        enabled: false,
        limits: {
          maxRules: { professional: 5, enterprise: 20 }
        }
      },
      history: {
        id: 'autoReplyHistory',
        key: 'autoReplyHistory',
        label: 'Historia auto-odpowiedzi',
        icon: 'pi pi-history',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Przeglądanie historii automatycznych odpowiedzi',
        enabled: false
      },
      templates: {
        id: 'autoReplyTemplates',
        key: 'autoReplyTemplates',
        label: 'Szablony dla auto-odpowiedzi',
        icon: 'pi pi-file',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Szablony dostępne w auto-odpowiedziach',
        enabled: false,
        limits: {
          maxTemplates: { professional: 10, enterprise: 999 }
        }
      }
    }
  },
  photoMonitoring: {
    id: 'photoMonitoring',
    key: 'syncPhotos',
    label: 'Monitoring zdjęć',
    icon: 'pi pi-images',
    requiredPlan: 'basic',
    planName: 'Basic',
    description: 'Powiadomienia o nowych zdjęciach od klientów',
    enabled: true,
    limits: {
      maxPhotosPerMonth: { basic: 50, professional: 500, enterprise: 9999 }
    }
  },
  postPublishing: {
    id: 'postPublishing',
    key: 'autoPost',
    label: 'Publikacja postów',
    icon: 'pi pi-calendar',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Planowanie i publikacja postów na profilu firmy',
    enabled: false,
    children: {
      scheduling: {
        id: 'postScheduling',
        key: 'postScheduling',
        label: 'Planowanie postów',
        icon: 'pi pi-calendar-plus',
        requiredPlan: 'professional',
        planName: 'Professional',
        description: 'Harmonogram publikacji postów',
        enabled: false,
        limits: {
          maxScheduledPosts: { professional: 30, enterprise: 999 }
        }
      },
      analytics: {
        id: 'postAnalytics',
        key: 'postAnalytics',
        label: 'Analityka postów',
        icon: 'pi pi-chart-line',
        requiredPlan: 'enterprise',
        planName: 'Enterprise',
        description: 'Szczegółowa analityka zasięgów i zaangażowania',
        enabled: false
      }
    }
  },
  dataProtection: {
    id: 'dataProtection',
    key: 'protectData',
    label: 'Ochrona danych',
    icon: 'pi pi-shield',
    requiredPlan: 'basic',
    planName: 'Basic',
    description: 'Blokowanie nieautoryzowanych zmian w wizytówce',
    enabled: true
  },
  qaMonitoring: {
    id: 'qaMonitoring',
    key: 'monitorQA',
    label: 'Monitoring Q&A',
    icon: 'pi pi-question-circle',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Powiadomienia o pytaniach i sugestie odpowiedzi AI',
    enabled: false,
    limits: {
      maxQuestionsPerMonth: { professional: 100, enterprise: 999 }
    }
  },
  hoursSync: {
    id: 'hoursSync',
    key: 'syncHours',
    label: 'Godziny otwarcia',
    icon: 'pi pi-clock',
    requiredPlan: 'enterprise',
    planName: 'Enterprise',
    description: 'Automatyczna aktualizacja godzin w dni świąteczne',
    enabled: false
  }
};

// Convert hierarchy to flat list for TreeTable
export function convertHierarchyToTreeNodes(hierarchy, subscriptionPlan = 'basic') {
  const nodes = [];
  
  Object.values(hierarchy).forEach(feature => {
    const node = {
      key: feature.key,
      data: {
        id: feature.id,
        key: feature.key,
        label: feature.label,
        icon: feature.icon,
        requiredPlan: feature.requiredPlan,
        planName: feature.planName,
        description: feature.description,
        enabled: feature.enabled,
        limits: feature.limits || {},
        type: 'feature'
      },
      children: []
    };
    
    // Add children if they exist
    if (feature.children) {
      Object.values(feature.children).forEach(child => {
        node.children.push({
          key: child.key,
          data: {
            id: child.id,
            key: child.key,
            label: child.label,
            icon: child.icon,
            requiredPlan: child.requiredPlan,
            planName: child.planName,
            description: child.description,
            enabled: child.enabled,
            limits: child.limits || {},
            type: 'subfeature',
            parentKey: feature.key
          }
        });
      });
    }
    
    nodes.push(node);
  });
  
  return nodes;
}

// Get feature limit for current plan
export function getFeatureLimit(feature, limitKey, subscriptionPlan) {
  if (!feature.limits || !feature.limits[limitKey]) {
    return null;
  }
  
  const limits = feature.limits[limitKey];
  
  // Find the highest plan that has this limit
  const planHierarchy = { basic: 1, professional: 2, enterprise: 3 };
  const currentLevel = planHierarchy[subscriptionPlan] || 0;
  
  let bestLimit = null;
  let bestLevel = 0;
  
  Object.entries(limits).forEach(([plan, value]) => {
    const planLevel = planHierarchy[plan] || 0;
    if (planLevel <= currentLevel && planLevel > bestLevel) {
      bestLimit = value;
      bestLevel = planLevel;
    }
  });
  
  return bestLimit;
}

// Check if feature/subfeature is available in plan
export function isFeatureAvailableInPlan(feature, subscriptionPlan) {
  if (!feature.requiredPlan) return true;
  
  const planHierarchy = { basic: 1, professional: 2, enterprise: 3 };
  const requiredLevel = planHierarchy[feature.requiredPlan] || 0;
  const currentLevel = planHierarchy[subscriptionPlan] || 0;
  
  return currentLevel >= requiredLevel;
}





