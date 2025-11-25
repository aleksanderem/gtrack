import { computed } from 'vue';
import { useFeatureSettings } from '../stores/featureSettings';
import { FEATURES, PLAN_LEVELS, PLANS, PLAN_NAMES } from '../config/features';

export function useFeatures() {
    const { subscription, usage, featurePlans, featureLimits } = useFeatureSettings();

    // Get current plan level
    const currentPlanLevel = computed(() => {
        return PLAN_LEVELS[subscription.value.plan] || 0;
    });

    // Check if a feature is available (unlocked)
    const can = (featureKey) => {
        const feature = FEATURES[featureKey];
        if (!feature) {
            console.warn(`Feature ${featureKey} not found`);
            return false;
        }

        // Check for overridden required plan from debug settings
        let requiredPlan = featurePlans.value[featureKey];
        
        // If not overridden, use default from config
        if (!requiredPlan) {
            requiredPlan = feature.requiredPlan;
        }

        // If no required plan (neither overridden nor default), it's available to everyone
        if (!requiredPlan) return true;

        const requiredLevel = PLAN_LEVELS[requiredPlan] || 0;
        return currentPlanLevel.value >= requiredLevel;
    };

    // Check if a feature is locked
    const isLocked = (featureKey) => {
        return !can(featureKey);
    };

    // Get the limit for a specific feature and limit key based on current plan
    const getLimit = (featureKey, limitKey) => {
        const feature = FEATURES[featureKey];
        if (!feature) return null;

        const plan = subscription.value.plan;
        
        // Check for overridden limits
        const overriddenLimit = featureLimits.value[featureKey]?.[limitKey]?.[plan];
        if (overriddenLimit !== undefined) {
            return overriddenLimit;
        }
        
        // Fallback to default limits
        if (!feature.limits || !feature.limits[limitKey]) return null;
        return feature.limits[limitKey][plan];
    };

    // Check if usage is within limits
    // Returns true if usage < limit (or limit is infinite)
    const checkLimit = (featureKey, limitKey) => {
        const limit = getLimit(featureKey, limitKey);

        // If no limit defined, assume unlimited
        if (limit === undefined || limit === null) return true;

        // If limit is infinite (e.g. 999 or Infinity), return true
        if (limit === Infinity || limit >= 999) return true;

        // Get current usage
        // We assume usage keys match limit keys in the store
        const currentUsage = usage.value[limitKey] || 0;

        return currentUsage < limit;
    };

    // Get usage percentage (0-100)
    const getUsagePercentage = (featureKey, limitKey) => {
        const limit = getLimit(featureKey, limitKey);
        if (!limit || limit === Infinity || limit >= 999) return 0;

        const currentUsage = usage.value[limitKey] || 0;
        return Math.min(100, Math.round((currentUsage / limit) * 100));
    };

    // Get comprehensive limit status with warnings
    const getLimitStatus = (featureKey, limitKey, currentCount) => {
        const feature = FEATURES[featureKey];
        const limit = getLimit(featureKey, limitKey);

        if (!feature || limit === null) {
            return {
                hasLimit: false,
                isExceeded: false,
                message: null
            };
        }

        const isExceeded = currentCount > limit;
        const exceededBy = Math.max(0, currentCount - limit);
        const remaining = Math.max(0, limit - currentCount);
        const percentage = limit > 0 ? Math.round((currentCount / limit) * 100) : 0;

        // Determine severity
        let severity = 'info';
        if (isExceeded) {
            severity = 'danger';
        } else if (percentage >= 90) {
            severity = 'warning';
        } else if (percentage >= 75) {
            severity = 'warn';
        }

        // Build message
        let message = '';
        let upgradeMessage = '';

        if (isExceeded) {
            message = `Używasz ${currentCount}/${limit}. ${exceededBy} elementów jest nieaktywnych.`;
            // Find next plan that can accommodate current usage
            const plans = [PLANS.BASIC, PLANS.PROFESSIONAL, PLANS.ENTERPRISE];
            const currentPlanIndex = plans.indexOf(subscription.value.plan);

            for (let i = currentPlanIndex + 1; i < plans.length; i++) {
                const nextPlan = plans[i];
                const nextLimit = feature.limits?.[limitKey]?.[nextPlan];
                if (nextLimit && currentCount <= nextLimit) {
                    upgradeMessage = `Zwiększ pakiet do ${PLAN_NAMES[nextPlan]}, aby odblokować wszystkie elementy.`;
                    break;
                }
            }
            if (!upgradeMessage) {
                upgradeMessage = `Zwiększ pakiet, aby odblokować wszystkie elementy.`;
            }
        } else if (remaining <= 2 && limit < 999) {
            message = `Pozostało ${remaining} z ${limit} dostępnych.`;
        } else if (percentage >= 75 && limit < 999) {
            message = `Używasz ${currentCount}/${limit} (${percentage}%).`;
        }

        return {
            hasLimit: true,
            isExceeded,
            exceededBy,
            remaining,
            percentage,
            severity,
            message,
            upgradeMessage,
            currentCount,
            limit
        };
    };

    return {
        can,
        isLocked,
        getLimit,
        checkLimit,
        getUsagePercentage,
        getLimitStatus,
        updateUsage: useFeatureSettings().updateUsage,
        features: FEATURES,
        currentPlan: computed(() => subscription.value.plan),
        currentPlanLevel
    };
}
