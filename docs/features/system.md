# Feature System

## Overview
GTRACK uses a unified feature system to manage access control and limits across different subscription plans.

## Configuration
The source of truth is `src/config/features.js`.

### Feature Flags
Features are toggled on/off based on the plan.
```javascript
export const FEATURES = {
  BASIC: {
    autoReply: false,
    photoMonitoring: false
  },
  PROFESSIONAL: {
    autoReply: true,
    photoMonitoring: true
  }
}
```

### Plan Definitions
```javascript
export const PLANS = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
}
```

## Frontend Integration
The `useFeatures` composable provides reactive access to feature states.

```javascript
const { hasFeature, getLimit } = useFeatures();

if (hasFeature('autoReply')) {
  // Show auto-reply settings
}
```
