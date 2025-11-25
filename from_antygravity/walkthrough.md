# Feature Gating System Refactor Walkthrough

## Overview
This refactor centralized the feature gating logic, simplified component usage, and integrated usage tracking for quotas and limits. The system now includes **autodiscovery** - any new feature added to `features.js` automatically appears in settings and the Debug Bar without manual registration.

**All application modules are now covered**: Reviews, Map, Keywords, Comparison, Content, Settings, and toggleable features (Photo Monitoring, Post Publishing, Data Protection, Q&A Monitoring, Hours Sync).

## Key Features

### 1. Single Source of Truth
`src/config/features.js` defines everything:
```javascript
export const FEATURES = {
    aiAnalysis: {
        id: 'aiAnalysis',
        label: 'Wnioski AI',
        requiredPlan: PLANS.PROFESSIONAL,
        limits: {
            maxAnalysisPerMonth: { basic: 0, professional: 100, enterprise: 999 }
        }
    }
    // ... add more features here - they auto-appear everywhere
};
```

### 2. Autodiscovery
**No manual registration needed**. Components automatically discover all features:
- Debug Bar: `Object.values(FEATURES)` dynamically generates the feature list
- Business Settings: Iterates through all toggleable features
- Any new feature in `FEATURES` appears automatically

### 3. Unified API
One composable for everything:
```javascript
const { can, isLocked, getLimit, checkLimit, updateUsage } = useFeatures();
```

## Changes

### Core Files Created
- `src/config/features.js` - Central feature configuration
- `src/composables/useFeatures.js` - Unified composable

### Store Updates
- `src/stores/featureSettings.js`:
  - Feature keys now match Feature IDs (e.g., `photoMonitoring` instead of `syncPhotos`)
  - Usage tracking for all limits
  - Supports increment tracking

### Components Refactored (11 files)
- All review components (`ReviewsDashboard`, `AIAnalysis`, `FeatureCard`, `ReviewItem`, `ResponseTemplates`, `AutoReplySettings`, `TemplateSelector`)
- Settings components (`FeatureLicenseBadge`, `BusinessSettings`)
- Navigation (`TopBar`)
- Debug (`FeatureDebugBar`)

### Legacy Files Removed
- `featureHierarchy.js`
- `useFeatureFlags.js`
- `useFeatureLimits.js`

## How Autodiscovery Works

### Adding a New Feature
1. Add to `src/config/features.js`:
```javascript
newFeature: {
    id: 'newFeature',
    label: 'Nowa Funkcja',
    requiredPlan: PLANS.ENTERPRISE,
    icon: 'pi pi-star',
    limits: { maxItems: { basic: 10, professional: 100, enterprise: 999 } }
}
```

**Examples of complete modules in config:**
- **Reviews** (with sub-features: templates, AI analysis, auto-reply, acquisition, intercepted reviews)
- **Map** (basic, no sub-features)
- **Keywords** (with tracking and reports sub-features)
- **Comparison** (with competitor tracking and reports)
- **Content** (with editing and bulk update sub-features)

2. That's it! The feature now:
   - Appears in Debug Bar with plan selector
   - Shows in Business Settings (if it has a toggle)
   - Works with `can('newFeature')` and `getLimit('newFeature', 'maxItems')`

### How Components Auto-Discover

**Debug Bar:**
```javascript
const featureList = computed(() => {
  return Object.values(FEATURES).map(feature => ({
    feature: feature,
    configKey: feature.id
  }));
});
```

**Business Settings:**
```javascript
const featureCards = [
  { feature: features.autoReply, configKey: 'autoReply' },
  // ... manually curated list for this specific UI
];
```

## Verification

### Manual Tests
1. Open Debug Bar (Ctrl+Shift+D)
2. Verify all features from `FEATURES` appear in the list
3. Switch plans - verify features lock/unlock dynamically
4. Check that limits update based on plan
5. Toggle features on/off
6. Verify localStorage persistence

### Adding Test Feature
Try adding a test feature to `features.js`:
```javascript
testFeature: {
    id: 'testFeature',
    label: 'Test Feature',
    requiredPlan: PLANS.ENTERPRISE,
    icon: 'pi pi-bolt'
}
```
It should immediately appear in the Debug Bar without any other changes needed.
