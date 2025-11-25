import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFeatureSettings } from '../stores/featureSettings';

// Feature definitions with license requirements
export const FEATURES = {
  AUTO_REPLY: {
    id: 'autoReply',
    key: 'autoReply',
    label: 'Auto-odpowiedzi',
    icon: 'pi pi-comments',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Automatyczne odpowiadanie na opinie klientów',
    enabled: false
  },
  PHOTO_MONITORING: {
    id: 'photoMonitoring',
    key: 'syncPhotos',
    label: 'Monitoring zdjęć',
    icon: 'pi pi-images',
    requiredPlan: 'basic',
    planName: 'Basic',
    description: 'Powiadomienia o nowych zdjęciach od klientów',
    enabled: true
  },
  POST_PUBLISHING: {
    id: 'postPublishing',
    key: 'autoPost',
    label: 'Publikacja postów',
    icon: 'pi pi-calendar',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Planowanie i publikacja postów na profilu firmy',
    enabled: false
  },
  DATA_PROTECTION: {
    id: 'dataProtection',
    key: 'protectData',
    label: 'Ochrona danych',
    icon: 'pi pi-shield',
    requiredPlan: 'basic',
    planName: 'Basic',
    description: 'Blokowanie nieautoryzowanych zmian w wizytówce',
    enabled: true
  },
  QA_MONITORING: {
    id: 'qaMonitoring',
    key: 'monitorQA',
    label: 'Monitoring Q&A',
    icon: 'pi pi-question-circle',
    requiredPlan: 'professional',
    planName: 'Professional',
    description: 'Powiadomienia o pytaniach i sugestie odpowiedzi AI',
    enabled: false
  },
  HOURS_SYNC: {
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

// Plan hierarchy
const PLAN_HIERARCHY = {
  basic: 1,
  professional: 2,
  enterprise: 3
};

export function useFeatureFlags() {
  const router = useRouter();
  const { subscription } = useFeatureSettings();

  // Load feature plans from localStorage (for debug bar overrides)
  const getFeaturePlan = (featureKey) => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('featurePlans');
    if (saved) {
      try {
        const plans = JSON.parse(saved);
        return plans[featureKey] || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Get current subscription plan level
  const currentPlanLevel = computed(() => {
    return PLAN_HIERARCHY[subscription.value.plan] || 0;
  });

  // Check if feature is available in current plan
  const isFeatureAvailable = (feature) => {
    // Check for overridden plan from localStorage
    const overriddenPlan = getFeaturePlan(feature.key);
    const requiredPlan = overriddenPlan || feature.requiredPlan;
    if (!requiredPlan) return true;
    const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
    return currentPlanLevel.value >= requiredLevel;
  };

  // Check if feature is enabled (both available and turned on)
  const isFeatureEnabled = (feature, settings) => {
    if (!isFeatureAvailable(feature)) return false;
    return settings?.[feature.key] === true;
  };

  // Check if feature is locked (not available in current plan)
  const isFeatureLocked = (feature) => {
    return !isFeatureAvailable(feature);
  };

  // Navigate to settings when clicking locked feature
  const navigateToFeatureSettings = (feature) => {
    router.push({ 
      name: 'settings',
      query: { 
        tab: 'business',
        highlight: feature.key 
      }
    });
  };

  // Get feature status for menu items
  const getFeatureStatus = (feature, settings) => {
    if (isFeatureLocked(feature)) {
      return {
        available: false,
        locked: true,
        enabled: false,
        reason: 'license',
        requiredPlan: feature.requiredPlan,
        planName: feature.planName
      };
    }
    
    const enabled = settings?.[feature.key] === true;
    return {
      available: true,
      locked: false,
      enabled,
      reason: enabled ? null : 'disabled',
      requiredPlan: null,
      planName: null
    };
  };

  return {
    subscription,
    FEATURES,
    isFeatureAvailable,
    isFeatureEnabled,
    isFeatureLocked,
    navigateToFeatureSettings,
    getFeatureStatus
  };
}

