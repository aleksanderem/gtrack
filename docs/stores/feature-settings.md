# featureSettings Store

**File**: `src/stores/featureSettings.js`  
**Type**: Pinia Store (reactive)  
**Purpose**: Global state management for subscription, feature flags, usage tracking, and debug bar overrides

## Overview

`featureSettings` is the primary Pinia store for managing app-wide state that doesn't come from the backend. It handles subscription information, feature flag states, usage tracking, and supports debug bar overrides.

## Usage

```javascript
import { useFeatureSettings } from '@/stores/featureSettings';

const { 
  subscription, 
  usage, 
  featureSettings,
  featurePlans,
  featureLimits,
  loadSettings,
  updateSubscription,
  updateUsage
} = useFeatureSettings();
```

## State Structure

### `subscription`

Current subscription plan information.

**Type**: `Ref<{ plan: string, name: string }>`

**Structure:**
```typescript
{
  plan: 'basic' | 'professional' | 'enterprise',
  name: 'Basic' | 'Professional' | 'Enterprise'
}
```

**Default:**
```javascript
{
  plan: 'basic',
  name: 'Basic'
}
```

**Persistence**: Stored in `localStorage` key `'subscription'`

---

### `usage`

Usage tracking for limit enforcement.

**Type**: `Computed<Record<string, number>>`

**Structure:**
```typescript
{
  maxReviewsPerPage: number,
  maxTemplates: number,
  maxAnalysisPerMonth: number,
  maxAutoRepliesPerMonth: number,
  maxRules: number,
  maxInterceptedPerMonth: number,
  maxCampaigns: number,
  maxPhotosPerMonth: number,
  maxScheduledPosts: number,
  maxQuestionsPerMonth: number
}
```

**Default**: All values are `0` (mock data)

**Persistence**: Stored in `localStorage` key `'featureUsage'`

**Note**: Currently mocked. Real usage should come from Convex backend.

---

### `featureSettings`

Feature flags enabled/disabled state.

**Type**: `Computed<Record<string, boolean>>`

**Structure:**
```typescript
{
  [featureKey: string]: boolean
}
```

**Default**: All features enabled (`true`)

**Persistence**: Stored in `localStorage` key `'featureSettings'`

**Example:**
```javascript
{
  autoReply: false,
  photoMonitoring: true,
  postPublishing: false,
  dataProtection: true,
  qaMonitoring: false,
  hoursSync: false
}
```

---

### `featurePlans`

Debug bar overrides for feature required plans.

**Type**: `Computed<Record<string, string>>`

**Structure:**
```typescript
{
  [featureKey: string]: 'basic' | 'professional' | 'enterprise'
}
```

**Persistence**: Stored in `localStorage` key `'featurePlans'`

**Purpose**: Allows debug bar to override default plan requirements for testing.

**Example:**
```javascript
{
  autoReply: 'enterprise' // Override: require Enterprise instead of Professional
}
```

---

### `featureLimits`

Debug bar overrides for feature limits.

**Type**: `Computed<Record<string, Record<string, Record<string, number>>>>`

**Structure:**
```typescript
{
  [featureKey: string]: {
    [limitKey: string]: {
      [plan: string]: number
    }
  }
}
```

**Persistence**: Stored in `localStorage` key `'featureLimits'`

**Purpose**: Allows debug bar to override default limits for testing.

**Example:**
```javascript
{
  keywords: {
    maxKeywords: {
      professional: 5 // Override: set Professional limit to 5
    }
  }
}
```

---

## Methods

### `loadSettings()`

Loads all settings from localStorage or API.

**Signature:**
```typescript
loadSettings(): Promise<void>
```

**Flow:**
1. Loads `featureSettings` from localStorage
2. Merges with defaults (ensures all features present)
3. Loads `subscription` from localStorage
4. Loads `usage` from localStorage
5. Loads `featurePlans` from localStorage
6. Loads `featureLimits` from localStorage

**Error Handling:**
- Catches JSON parse errors
- Falls back to defaults on error

**Usage:**
```javascript
const { loadSettings } = useFeatureSettings();

onMounted(async () => {
  await loadSettings();
});
```

---

### `saveSettings(settings)`

Saves feature settings to localStorage or API.

**Signature:**
```typescript
saveSettings(settings: Record<string, boolean>): Promise<void>
```

**Parameters:**
- `settings` (object): Feature settings object

**Behavior:**
- Merges settings into `featureSettings` state
- Saves to localStorage
- Future: Will save to API

**Usage:**
```javascript
const { saveSettings } = useFeatureSettings();

await saveSettings({
  autoReply: true,
  photoMonitoring: false
});
```

---

### `updateFeature(key, value)`

Updates a single feature setting.

**Signature:**
```typescript
updateFeature(key: string, value: boolean): Promise<void>
```

**Parameters:**
- `key` (string): Feature key
- `value` (boolean): Enabled/disabled state

**Behavior:**
- Updates `featureSettings[key]`
- Calls `saveSettings()` to persist

**Usage:**
```javascript
const { updateFeature } = useFeatureSettings();

await updateFeature('autoReply', true);
```

---

### `updateSubscription(plan)`

Updates subscription plan.

**Signature:**
```typescript
updateSubscription(plan: string): Promise<void>
```

**Parameters:**
- `plan` (string): Plan ID (`'basic'`, `'professional'`, `'enterprise'`)

**Behavior:**
- Updates `subscription.value.plan`
- Updates `subscription.value.name` from `PLAN_NAMES`
- Saves to localStorage
- Future: Will update via API

**Usage:**
```javascript
const { updateSubscription } = useFeatureSettings();

await updateSubscription('professional');
```

---

### `updateUsage(key, value)`

Updates usage tracking (helper for demo/testing).

**Signature:**
```typescript
updateUsage(key: string, value: number | 'increment'): void
```

**Parameters:**
- `key` (string): Usage key (e.g., `'maxKeywords'`)
- `value` (number | 'increment'): Value to set or `'increment'` to add 1

**Behavior:**
- If `value` is number: Sets `usage[key] = value`
- If `value` is `'increment'`: Increments `usage[key]`
- Saves to localStorage

**Usage:**
```javascript
const { updateUsage } = useFeatureSettings();

// Set value
updateUsage('maxKeywords', 5);

// Increment
updateUsage('maxKeywords', 'increment');
```

**Note**: This is for demo/testing. Real usage should come from backend.

---

### `isFeatureEnabled(key)`

Checks if a feature is enabled.

**Signature:**
```typescript
isFeatureEnabled(key: string): boolean
```

**Parameters:**
- `key` (string): Feature key

**Returns:**
- `boolean`: `true` if enabled, `false` if disabled

**Usage:**
```javascript
const { isFeatureEnabled } = useFeatureSettings();

if (isFeatureEnabled('autoReply')) {
  // Feature is enabled
}
```

---

## Persistence

All state is persisted to `localStorage`:

- `'featureSettings'`: Feature flags
- `'subscription'`: Subscription plan
- `'featureUsage'`: Usage tracking
- `'featurePlans'`: Debug bar plan overrides
- `'featureLimits'`: Debug bar limit overrides

**Loading:**
- Automatically loaded on app start (via `loadSettings()`)
- Merged with defaults to ensure all features present

**Saving:**
- Automatically saved on updates
- Future: Will sync with Convex backend

---

## Integration with Components

### Settings View

```javascript
// LocationSettingsView.vue
const { featureSettings } = useFeatureSettings();

// Sync with backend
watch(orgData, (org) => {
  if (org.featureFlags) {
    Object.keys(org.featureFlags).forEach(key => {
      featureSettings.value[key] = org.featureFlags[key];
    });
  }
});
```

### Feature Checking

```javascript
// Any component
import { useFeatures } from '@/composables/useFeatures';

const { can } = useFeatures(); // Uses featureSettings internally
```

---

## Debug Bar Integration

The store supports debug bar overrides:

1. **Plan Overrides**: `featurePlans` - Override required plan for features
2. **Limit Overrides**: `featureLimits` - Override limits for features

**Debug Bar Usage:**
```javascript
// Debug bar sets overrides
localStorage.setItem('featurePlans', JSON.stringify({
  autoReply: 'enterprise'
}));

// Store automatically loads on next access
const { featurePlans } = useFeatureSettings();
console.log(featurePlans.value.autoReply); // 'enterprise'
```

---

## Future Enhancements

1. **Backend Sync**: Sync with Convex `organizations.featureFlags`
2. **Real Usage**: Get usage from Convex `featureUsage` table
3. **Subscription API**: Update subscription via payment provider API
4. **Real-time Updates**: Subscribe to backend changes
5. **Offline Support**: Queue updates when offline
