# Feature Debug Bar

The **Feature Debug Bar** is a developer tool used to simulate different subscription plans and feature configurations without changing the actual database state.

## Core Concept: Local Overrides

The Debug Bar works by intercepting the feature check logic in `useFeatures.js` and injecting overrides stored in `localStorage`.

### Data Flow
1.  **Static Config**: `src/config/features.js` defines the default requirements (e.g., "Auto Reply requires Professional").
2.  **Local Storage**: The Debug Bar saves overrides to `featurePlans` and `featureLimits`.
3.  **Composable**: `useFeatures.js` checks:
    ```javascript
    // Pseudo-code
    function can(feature) {
      const override = localStorage.getItem('featurePlans')[feature];
      const requiredPlan = override || feature.requiredPlan;
      return currentPlan >= requiredPlan;
    }
    ```

## Functionality

### 1. Plan Simulation
You can switch the global "Subscription Plan" (Basic/Pro/Enterprise) to see how the UI reacts. This updates the `subscription` state in `featureSettings` store.

### 2. Feature Locking
You can manually "lock" or "unlock" specific features by changing their required plan.
- **Example**: Make "Auto Reply" require "Enterprise" instead of "Professional" to test the upgrade banner.

### 3. Limit Manipulation
You can override the numeric limits for any feature.
- **Example**: Set "Max Keywords" to 5 to test the limit reached state, even if your plan allows 50.

### 4. Frequency Toggles
For features with schedules (like Scanning), you can toggle which frequencies (Daily, Weekly) are available for the current plan.

## Persistence
All changes made in the Debug Bar are saved to `localStorage`.
- `featurePlans`: Overrides for required plans.
- `featureLimits`: Overrides for numeric limits.
- `featureFrequencies`: Overrides for available schedules.

Clicking **"Reset"** clears these keys and restores the application to the default configuration defined in `src/config/features.js`.
