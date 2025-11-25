# useFeatures Composable

**File**: `src/composables/useFeatures.js`  
**Purpose**: Provides reactive helpers for checking feature availability, limits, and plan permissions

## Overview

`useFeatures` is the primary composable for feature gating and limit checking throughout the application. It integrates with the feature configuration (`src/config/features.js`), the feature settings store (`featureSettings.js`), and supports debug bar overrides.

## Usage

```javascript
import { useFeatures } from '@/composables/useFeatures';

const { can, isLocked, getLimit, checkLimit, getLimitStatus } = useFeatures();
```

## Returned Functions

### `can(featureKey)`

Checks if a feature is available (unlocked) for the current plan.

**Parameters:**
- `featureKey` (string): Feature ID from `FEATURES` config

**Returns:**
- `boolean`: `true` if feature is available, `false` if locked

**Logic:**
1. Gets feature definition from `FEATURES` config
2. Checks for debug bar override in `localStorage` (`featurePlans`)
3. Gets required plan (override or default from config)
4. Compares current plan level with required plan level
5. Returns `true` if current level >= required level

**Example:**
```javascript
const { can } = useFeatures();

if (can('autoReply')) {
  // Show auto-reply settings
} else {
  // Show upgrade banner
}
```

**Plan Levels:**
- Basic: 1
- Professional: 2
- Enterprise: 3

---

### `isLocked(featureKey)`

Checks if a feature is locked (not available in current plan).

**Parameters:**
- `featureKey` (string): Feature ID

**Returns:**
- `boolean`: `true` if locked, `false` if available

**Implementation:**
```javascript
const isLocked = (featureKey) => {
  return !can(featureKey);
};
```

**Example:**
```javascript
const { isLocked } = useFeatures();

if (isLocked('autoReply')) {
  showUpgradeBanner();
}
```

---

### `getLimit(featureKey, limitKey)`

Gets the limit value for a specific feature and limit key based on current plan.

**Parameters:**
- `featureKey` (string): Feature ID
- `limitKey` (string): Limit key (e.g., `'maxKeywords'`, `'maxAudits'`)

**Returns:**
- `number | null`: Limit value or `null` if no limit defined

**Logic:**
1. Gets feature definition from `FEATURES` config
2. Checks for debug bar override in `localStorage` (`featureLimits`)
3. Gets current plan from store
4. Returns override limit if exists, otherwise default limit from config
5. Returns `null` if no limit defined

**Example:**
```javascript
const { getLimit } = useFeatures();

const maxKeywords = getLimit('keywords', 'maxKeywords');
console.log(maxKeywords); // 50 (if professional plan)

if (keywords.length >= maxKeywords) {
  // Limit reached
}
```

**Limit Keys:**
- `maxKeywords`: Maximum keywords
- `maxAudits`: Maximum SEO audits per month
- `maxTemplates`: Maximum response templates
- `maxAutoRepliesPerMonth`: Maximum auto-replies
- `maxInterceptedPerMonth`: Maximum intercepted reviews
- And more (see `src/config/features.js`)

---

### `checkLimit(featureKey, limitKey)`

Checks if current usage is within the limit.

**Parameters:**
- `featureKey` (string): Feature ID
- `limitKey` (string): Limit key

**Returns:**
- `boolean`: `true` if within limit, `false` if exceeded

**Logic:**
1. Gets limit using `getLimit()`
2. If no limit defined, returns `true` (unlimited)
3. If limit is infinite (999 or Infinity), returns `true`
4. Gets current usage from store (`usage.value[limitKey]`)
5. Returns `usage < limit`

**Example:**
```javascript
const { checkLimit } = useFeatures();

if (checkLimit('keywords', 'maxKeywords')) {
  // Can add keyword
} else {
  // Limit reached
}
```

---

### `getUsagePercentage(featureKey, limitKey)`

Gets usage percentage (0-100).

**Parameters:**
- `featureKey` (string): Feature ID
- `limitKey` (string): Limit key

**Returns:**
- `number`: Percentage (0-100), or 0 if unlimited

**Logic:**
1. Gets limit using `getLimit()`
2. If no limit or infinite, returns 0
3. Gets current usage from store
4. Returns `Math.min(100, Math.round((usage / limit) * 100))`

**Example:**
```javascript
const { getUsagePercentage } = useFeatures();

const percentage = getUsagePercentage('keywords', 'maxKeywords');
console.log(percentage); // 60 (if using 30/50)

// Use in progress bar
<ProgressBar :value="percentage" />
```

---

### `getLimitStatus(featureKey, limitKey, currentCount)`

Gets comprehensive limit status with warnings and upgrade messages.

**Parameters:**
- `featureKey` (string): Feature ID
- `limitKey` (string): Limit key
- `currentCount` (number): Current usage count

**Returns:**
```typescript
{
  hasLimit: boolean;           // Whether limit is defined
  isExceeded: boolean;          // Whether limit is exceeded
  exceededBy: number;          // How many over limit (0 if not exceeded)
  remaining: number;           // How many remaining (0 if exceeded)
  percentage: number;          // Usage percentage (0-100)
  severity: string;            // 'info' | 'warn' | 'warning' | 'danger'
  message: string | null;      // Status message
  upgradeMessage: string | null; // Upgrade suggestion
  currentCount: number;        // Current usage
  limit: number | null         // Limit value
}
```

**Severity Levels:**
- `'info'`: Normal usage (< 75%)
- `'warn'`: High usage (75-90%)
- `'warning'`: Very high usage (90-100%)
- `'danger'`: Limit exceeded (> 100%)

**Example:**
```javascript
const { getLimitStatus } = useFeatures();

const status = getLimitStatus('keywords', 'maxKeywords', keywords.length);

if (status.isExceeded) {
  toast.add({
    severity: 'error',
    summary: 'Limit osiągnięty',
    detail: status.message
  });
}

// Display in UI
<LimitProgressBar :status="status" />
```

**Messages:**
- Exceeded: `"Używasz {current}/{limit}. {exceededBy} elementów jest nieaktywnych."`
- Near limit: `"Pozostało {remaining} z {limit} dostępnych."`
- High usage: `"Używasz {current}/{limit} ({percentage}%)."`

**Upgrade Messages:**
- Automatically finds next plan that can accommodate current usage
- Example: `"Zwiększ pakiet do Professional, aby odblokować wszystkie elementy."`

---

## Returned Properties

### `features`

Direct access to `FEATURES` config object.

**Example:**
```javascript
const { features } = useFeatures();

console.log(features.autoReply.label); // "Auto-odpowiedzi"
console.log(features.autoReply.requiredPlan); // "professional"
```

### `currentPlan`

Computed property returning current subscription plan.

**Returns:**
- `string`: `'basic'` | `'professional'` | `'enterprise'`

**Example:**
```javascript
const { currentPlan } = useFeatures();

console.log(currentPlan); // "professional"
```

### `currentPlanLevel`

Computed property returning current plan level (1-3).

**Returns:**
- `number`: 1 (Basic), 2 (Professional), or 3 (Enterprise)

**Example:**
```javascript
const { currentPlanLevel } = useFeatures();

console.log(currentPlanLevel); // 2
```

### `updateUsage`

Function to update usage tracking (for testing/demo).

**Signature:**
```javascript
updateUsage(key: string, value: number | 'increment')
```

**Example:**
```javascript
const { updateUsage } = useFeatures();

// Set specific value
updateUsage('maxKeywords', 5);

// Increment
updateUsage('maxKeywords', 'increment');
```

**Note**: This is a helper for demo/testing. Real usage should come from backend.

---

## Debug Bar Integration

`useFeatures` supports debug bar overrides stored in `localStorage`:

### Feature Plan Overrides

**Storage Key**: `featurePlans`  
**Format**: `{ [featureKey]: requiredPlan }`

**Example:**
```javascript
localStorage.setItem('featurePlans', JSON.stringify({
  autoReply: 'enterprise' // Override: require Enterprise instead of Professional
}));
```

**Effect**: `can('autoReply')` will check against Enterprise plan instead of Professional.

### Feature Limit Overrides

**Storage Key**: `featureLimits`  
**Format**: `{ [featureKey]: { [limitKey]: { [plan]: value } } }`

**Example:**
```javascript
localStorage.setItem('featureLimits', JSON.stringify({
  keywords: {
    maxKeywords: {
      professional: 5 // Override: set Professional limit to 5 instead of 50
    }
  }
}));
```

**Effect**: `getLimit('keywords', 'maxKeywords')` will return 5 for Professional plan.

---

## Integration with Store

`useFeatures` uses `useFeatureSettings()` store for:
- Current subscription plan
- Usage tracking
- Feature plan overrides
- Feature limit overrides

**Store Structure:**
```javascript
{
  subscription: {
    plan: 'professional',
    name: 'Professional'
  },
  usage: {
    maxKeywords: 5,
    maxAudits: 2,
    // ...
  },
  featurePlans: {}, // Overrides
  featureLimits: {}  // Overrides
}
```

---

## Usage Examples

### Feature Gating in Template

```vue
<template>
  <div v-if="can('autoReply')">
    <AutoReplySettings />
  </div>
  <div v-else>
    <UpgradeBanner feature="autoReply" />
  </div>
</template>

<script setup>
import { useFeatures } from '@/composables/useFeatures';

const { can } = useFeatures();
</script>
```

### Limit Checking Before Action

```vue
<script setup>
import { useFeatures } from '@/composables/useFeatures';

const { getLimit, checkLimit } = useFeatures();
const keywords = ref([]);

const addKeyword = async (keyword) => {
  const limit = getLimit('keywords', 'maxKeywords');
  
  if (!checkLimit('keywords', 'maxKeywords')) {
    toast.add({
      severity: 'error',
      summary: 'Limit osiągnięty',
      detail: `Maksymalna liczba słów kluczowych: ${limit}`
    });
    return;
  }
  
  // Proceed with adding keyword
  await convex.mutation(api.keywords.addKeyword, { keyword });
};
</script>
```

### Progress Bar Display

```vue
<template>
  <LimitProgressBar 
    :status="limitStatus"
    :limit="limit"
    :current="keywords.length"
  />
</template>

<script setup>
import { useFeatures } from '@/composables/useFeatures';

const { getLimitStatus, getLimit } = useFeatures();
const keywords = ref([]);

const limitStatus = computed(() => 
  getLimitStatus('keywords', 'maxKeywords', keywords.length)
);

const limit = computed(() => 
  getLimit('keywords', 'maxKeywords')
);
</script>
```

---

## Related Files

- `src/config/features.js`: Feature definitions and limits
- `src/stores/featureSettings.js`: Pinia store for subscription and usage
- `src/composables/useFeatureFlags.js`: Feature flags management
- `src/composables/useFeatureLimits.js`: Alternative limit checking helpers
