import { ref, reactive, computed } from 'vue';

// Global feature settings store
const featureSettings = reactive({
  autoReply: false,
  syncPhotos: true,
  autoPost: false,
  protectData: true,
  monitorQA: false,
  syncHours: false
});

// Subscription info
const subscription = ref({
  plan: 'basic', // 'basic' | 'professional' | 'enterprise'
  name: 'Basic Plan'
});

export function useFeatureSettings() {
  // Load settings from localStorage or API
  const loadSettings = async () => {
    // In real app, this would fetch from API
    const saved = localStorage.getItem('featureSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(featureSettings, parsed);
      } catch (e) {
        console.error('Failed to load feature settings', e);
      }
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
      name: plan === 'basic' ? 'Basic Plan' : 
            plan === 'professional' ? 'Professional Plan' : 
            'Enterprise Plan'
    };
    localStorage.setItem('subscription', JSON.stringify(subscription.value));
    // In real app, this would update via API
  };

  // Check if feature is enabled
  const isFeatureEnabled = (key) => {
    return featureSettings[key] === true;
  };

  return {
    featureSettings: computed(() => featureSettings),
    subscription,
    loadSettings,
    saveSettings,
    updateFeature,
    updateSubscription,
    isFeatureEnabled
  };
}

