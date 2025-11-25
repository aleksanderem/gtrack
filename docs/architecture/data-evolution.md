# Data Architecture & Evolution

## The "Hybrid State"

The application is currently in a transition phase between static mock data and real backend data. Understanding this is critical for development.

### 1. Legacy Mocks (`useLocationData.js`)
Historically, the app was a frontend-only prototype.
- **File**: `src/composables/useLocationData.js`
- **Status**: **Active (Partial)**
- **Role**: Still provides data for the **Main Dashboard** (Traffic charts, Review summaries) and the **Map View**.
- **Data**: Hardcoded static objects (`dublin-painters`, random traffic stats).

### 2. Real Backend (`Convex`)
We are progressively migrating features to the Convex backend.
- **Status**: **Active (Settings & Keywords)**
- **Role**: Source of truth for **Settings**, **Keywords**, and **SEO Audits**.

### 3. The Bridge
Currently, we have a split source of truth:

| Feature | Source | Component |
| :--- | :--- | :--- |
| **Business Profile** | Convex (`organizations`) | `BusinessSettings.vue` |
| **Grid Config** | Convex (`organizations`) | `LocationSettingsView.vue` |
| **Keywords List** | Convex (`keywords`) | `KeywordsSettings.vue` |
| **Map Visualization** | **Mock** (`useLocationData`) | `MapView.vue` |
| **Traffic Charts** | **Mock** (`useLocationData`) | `AcquisitionPanel.vue` |
| **Reviews List** | **Mock** (`useLocationData`) | `ReviewsDashboard.vue` |

## Migration Strategy

The goal is to replace `useLocationData` entirely with Convex queries.

### Next Steps
1.  **Map Visualization**: Update `MapView.vue` to read `gridSettings` from Convex instead of the mock.
2.  **Reviews**: Create a `reviews` table in Convex and migrate `ReviewsDashboard.vue`.
3.  **Traffic**: Create an analytics table or integration for traffic stats.

> [!IMPORTANT]
> When working on **Settings** or **Keywords**, ignore `useLocationData`. Use `convex.onUpdate` to fetch the real state.
> When working on the **Dashboard**, you are currently still working with mocks.
