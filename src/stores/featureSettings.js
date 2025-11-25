import { ref, reactive, computed } from 'vue';
import { PLANS, PLAN_NAMES, FEATURES } from '../config/features';

// Helper function to generate default feature settings (all enabled)
const getDefaultFeatureSettings = () => {
  const defaults = {};
  // Set all features to enabled by default
  Object.keys(FEATURES).forEach(key => {
    defaults[key] = true;
  });
  return defaults;
};

// Global feature settings store
const featureSettings = reactive(getDefaultFeatureSettings());

// Subscription info
const subscription = ref({
  plan: PLANS.BASIC,
  name: PLAN_NAMES[PLANS.BASIC]
});

// Usage tracking (mocked for now)
const usage = reactive({
  maxReviewsPerPage: 0, // Not typically tracked as usage, but kept for consistency
  maxTemplates: 0,
  maxAnalysisPerMonth: 0,
  maxAutoRepliesPerMonth: 0,
  maxRules: 0,
  maxInterceptedPerMonth: 0,
  maxCampaigns: 0,
  maxPhotosPerMonth: 0,
  maxScheduledPosts: 0,
  maxQuestionsPerMonth: 0
});

// Feature specific plans and limits (overrides)
const featurePlans = reactive({});
const featureLimits = reactive({});

export function useFeatureSettings() {
  // Load settings from localStorage or API
  const loadSettings = async () => {
    // In real app, this would fetch from API
    const saved = localStorage.getItem('featureSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all features are present
        const defaults = getDefaultFeatureSettings();
        Object.assign(featureSettings, defaults, parsed);
      } catch (e) {
        console.error('Failed to load feature settings', e);
        // On error, ensure defaults are set
        Object.assign(featureSettings, getDefaultFeatureSettings());
      }
    } else {
      // If no saved settings, ensure defaults are set
      Object.assign(featureSettings, getDefaultFeatureSettings());
    }

    // Load subscription
    const savedSubscription = localStorage.getItem('subscription');
    if (savedSubscription) {
      try {
        subscription.value = JSON.parse(savedSubscription);
      } catch (e) {
        console.error('Failed to load subscription', e);
      }
    }

    // Load usage (mock)
    const savedUsage = localStorage.getItem('featureUsage');
    if (savedUsage) {
      try {
        const parsed = JSON.parse(savedUsage);
        Object.assign(usage, parsed);
      } catch (e) {
        console.error('Failed to load usage', e);
      }
    }
    
    // Load feature plans overrides
    const savedPlans = localStorage.getItem('featurePlans');
    if (savedPlans) {
      try {
        const parsed = JSON.parse(savedPlans);
        Object.assign(featurePlans, parsed);
      } catch (e) {
        console.error('Failed to load feature plans', e);
      }
    }
    
    // Load feature limits overrides
    const savedLimits = localStorage.getItem('featureLimits');
    if (savedLimits) {
      try {
        const parsed = JSON.parse(savedLimits);
        Object.assign(featureLimits, parsed);
      } catch (e) {
        console.error('Failed to load feature limits', e);
      }
    }
  };

  // Save settings to localStorage or API
  const saveSettings = async (settings) => {
    Object.assign(featureSettings, settings);
    localStorage.setItem('featureSettings', JSON.stringify(featureSettings));
    // In real app, this would save to API
  };

  // Update single feature
  const updateFeature = async (key, value) => {
    featureSettings[key] = value;
    await saveSettings(featureSettings);
  };

  // Update subscription
  const updateSubscription = async (plan) => {
    subscription.value = {
      plan,
      name: PLAN_NAMES[plan] || 'Unknown Plan'
    };
    localStorage.setItem('subscription', JSON.stringify(subscription.value));
    // In real app, this would update via API
  };

  // Update usage (helper for demo/testing)
  const updateUsage = (key, value) => {
    if (typeof value === 'number') {
      usage[key] = value;
    } else if (value === 'increment') {
      usage[key] = (usage[key] || 0) + 1;
    }
    localStorage.setItem('featureUsage', JSON.stringify(usage));
  };

  // Check if feature is enabled
  const isFeatureEnabled = (key) => {
    return featureSettings[key] === true;
  };

  return {
    featureSettings: computed(() => featureSettings),
    subscription,
    usage: computed(() => usage),
    featurePlans: computed(() => featurePlans),
    featureLimits: computed(() => featureLimits),
    loadSettings,
    saveSettings,
    updateFeature,
    updateSubscription,
    updateUsage,
    isFeatureEnabled
  };
}

