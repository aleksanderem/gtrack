import { computed } from 'vue';
import { useFeatureSettings } from '../stores/featureSettings';
import { FEATURE_HIERARCHY, getFeatureLimit } from './featureHierarchy';

export function useFeatureLimits() {
  const { subscription } = useFeatureSettings();

  // Find feature in hierarchy by key
  const findFeature = (key) => {
    for (const feature of Object.values(FEATURE_HIERARCHY)) {
      if (feature.key === key) {
        return feature;
      }
      if (feature.children) {
        for (const child of Object.values(feature.children)) {
          if (child.key === key) {
            return child;
          }
        }
      }
    }
    return null;
  };

  // Get current limit for a feature
  const getCurrentLimit = (featureKey, limitKey) => {
    const feature = findFeature(featureKey);
    if (!feature) return null;
    
    // Check localStorage overrides
    if (typeof window !== 'undefined') {
      const savedLimits = localStorage.getItem('featureLimits');
      if (savedLimits) {
        try {
          const limits = JSON.parse(savedLimits);
          if (limits[featureKey] && limits[featureKey][limitKey]) {
            const overrideLimits = limits[featureKey][limitKey];
            const currentPlan = subscription.value.plan;
            if (overrideLimits[currentPlan] !== undefined) {
              return overrideLimits[currentPlan];
            }
          }
        } catch (e) {
          console.error('Failed to parse feature limits', e);
        }
      }
    }
    
    return getFeatureLimit(feature, limitKey, subscription.value.plan);
  };

  // Check if limit is exceeded
  const isLimitExceeded = (featureKey, limitKey, currentCount) => {
    const limit = getCurrentLimit(featureKey, limitKey);
    if (limit === null) return false; // No limit
    return currentCount >= limit;
  };

  // Get remaining count before limit
  const getRemainingCount = (featureKey, limitKey, currentCount) => {
    const limit = getCurrentLimit(featureKey, limitKey);
    if (limit === null) return null; // No limit
    return Math.max(0, limit - currentCount);
  };

  // Get limit message for UI
  const getLimitMessage = (featureKey, limitKey, currentCount) => {
    const limit = getCurrentLimit(featureKey, limitKey);
    if (limit === null) return null;
    
    const remaining = getRemainingCount(featureKey, limitKey, currentCount);
    const planName = subscription.value.name;
    
    if (remaining === 0) {
      return {
        severity: 'warn',
        summary: 'Limit osiągnięty',
        detail: `Osiągnięto limit ${limit} dla planu ${planName}. Zaktualizuj plan, aby zwiększyć limit.`,
        canProceed: false
      };
    }
    
    return {
      severity: 'info',
      summary: 'Limit',
      detail: `Używane: ${currentCount}/${limit} (pozostało: ${remaining})`,
      canProceed: true
    };
  };

  // Get all limits for a feature
  const getFeatureLimits = (featureKey) => {
    const feature = findFeature(featureKey);
    if (!feature || !feature.limits) return {};
    
    const limits = {};
    Object.keys(feature.limits).forEach(limitKey => {
      limits[limitKey] = getCurrentLimit(featureKey, limitKey);
    });
    
    return limits;
  };

  return {
    getCurrentLimit,
    isLimitExceeded,
    getRemainingCount,
    getLimitMessage,
    getFeatureLimits,
    subscription: computed(() => subscription.value)
  };
}



