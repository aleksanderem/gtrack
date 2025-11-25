# Dashboard (Map View)

The **Dashboard** is the landing page of the application (`/`). It provides a high-level overview of the business's local visibility.

## Components Structure

```
LocationMapView.vue (View)
├── BusinessPanel.vue (Left Sidebar)
│   ├── Visibility Score (Mock)
│   ├── Competitors List (Mock)
│   └── Quick Actions
└── GoogleMapView.vue (Main Content)
    ├── Grid Visualization
    └── Interactive Markers
```

## Data Flow

### 1. Grid Configuration
- **Source**: `useLocationData.js` (Mock) -> `gridConfig`
- **Interaction**: User can change grid size (e.g., 3x3 to 9x9). This updates the local `gridConfig` ref but is **not yet persisted** to the backend.

### 2. Business Data
- **Source**: `LocationMapView.vue` (Local State + Mock Generators)
- **Logic**:
    - `generateBusinessListings()`: Creates random competitor data (names, ratings) on the fly.
    - `updateVisibilityMetrics()`: Calculates a fake "Visibility %" based on the selected grid point.
- **Trigger**: Clicking a map marker triggers `loadBusinessListings()`, simulating an API call with a 900ms delay.

### 3. Map Visualization
- **Component**: `GoogleMapView.vue`
- **Library**: `@googlemaps/js-api-loader`
- **Logic**: Renders a grid of circles based on `gridConfig`. Color coding (Green/Yellow/Red) is currently randomized or based on mock ranking data.

## Charts & Visuals
*Currently, the main dashboard does not contain charts. Traffic charts are located in the "Acquisition" tab of the Reviews module.*
