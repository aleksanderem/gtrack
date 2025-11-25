# LocationMapView Component

**File**: `src/views/LocationMapView.vue`  
**Route**: `/map` (default route for `/:locationId`)  
**Purpose**: Main dashboard view displaying map visualization with business panel

## Overview

`LocationMapView` is the primary dashboard view of the application. It displays an interactive map with a grid overlay showing keyword ranking positions, along with a business panel showing competitor information and visibility metrics.

## Component Structure

```
LocationMapView.vue
├── BusinessPanel (Left Sidebar)
│   ├── User Position Display
│   ├── Visibility Percentage
│   ├── Difficulty Level
│   ├── Keywords Count
│   ├── Competitors List
│   └── Loading State
└── GoogleMapView (Main Content)
    ├── Leaflet Map Instance
    ├── Grid Visualization
    ├── Marker Clustering
    └── Interactive Markers
```

## Props

None (this is a route component)

## Events

None (doesn't emit events to parent)

## Data Sources

### Mock Data (Current)
- **Location Data**: `useLocationData()` composable
  - `location`: Hardcoded location object
  - `keywords`: Hardcoded keywords array
  - `gridConfig`: Grid configuration (partially from Convex in future)

### Real Data (Future)
- **Grid Config**: Will come from Convex `organizations.getCurrent` → `gridSettings`
- **Keywords**: Will come from Convex `keywords.getKeywords`

## State Management

### Local State
```javascript
const userPosition = ref(9);              // Current ranking position
const visibilityPercent = ref(60);        // Visibility percentage (0-100)
const difficulty = ref('ŚREDNIA');        // Difficulty level
const isLoadingBusinessData = ref(false);  // Loading state for competitors
const competitors = ref([]);              // Competitor listings
const mapRefreshKey = ref(0);             // Key to force map refresh
const selectedRanking = ref(null);         // Currently selected ranking
```

### Composables Used
- `useLocationData()`: Provides mock location, keywords, and gridConfig

### Stores Used
None

## Methods

### `generateBusinessListings(ranking)`
Generates mock competitor data based on selected ranking position.

**Parameters:**
- `ranking` (number): The ranking position (1-20+)

**Returns:**
- `Array<Competitor>`: Array of competitor objects

**Competitor Object Structure:**
```typescript
{
  name: string;           // Business name
  initials: string;      // First letters of name
  position: number;      // Ranking position (1-based)
  rating: number;        // Rating (4.0-5.0)
  reviewCount: number;   // Number of reviews (80-480)
  description: string;   // Random description
  address: string;      // Street address
  phone: string | null; // Phone number (optional)
  photoUrl: null;       // Photo URL (currently null)
}
```

**Logic:**
- Generates 6-10 competitors
- Randomly selects from predefined business names
- Calculates ratings and review counts
- Assigns random addresses from Dublin street names

### `updateVisibilityMetrics(ranking)`
Updates visibility and difficulty metrics based on ranking position.

**Parameters:**
- `ranking` (number): The ranking position

**Side Effects:**
- Updates `selectedRanking.value`
- Updates `userPosition.value` (capped at 20)
- Updates `visibilityPercent.value` (calculated: (21 - normalized) * 5)
- Updates `difficulty.value` based on ranges:
  - 1-5: 'NISKA'
  - 6-10: 'ŚREDNIA'
  - 11-15: 'WYSOKA'
  - 16-20: 'BARDZO WYSOKA'

### `loadBusinessListings(ranking, delay = 900)`
Loads competitor listings with a simulated delay.

**Parameters:**
- `ranking` (number): The ranking position
- `delay` (number): Delay in milliseconds (default: 900)

**Side Effects:**
- Sets `isLoadingBusinessData.value = true`
- Clears `competitors.value`
- After delay, generates and sets competitors
- Sets `isLoadingBusinessData.value = false`

**Timer Management:**
- Clears previous timer if exists
- Stores timer in `businessLoadTimer` for cleanup

### `onMarkerSelected(ranking)`
Handler for marker selection events from GoogleMapView.

**Parameters:**
- `ranking` (number): The ranking position from marker

**Flow:**
1. Calls `loadBusinessListings(ranking)`
2. Updates visibility metrics
3. Shows loading state
4. Generates competitors after delay

### `onBusinessPanelOpen(ranking)`
Handler for business panel open events.

**Parameters:**
- `ranking` (number): The ranking position

**Side Effects:**
- Sets `selectedRanking.value = ranking`

### `openInGoogle()`
Opens Google Maps in new tab.

**Implementation:**
```javascript
window.open('https://www.google.com/maps', '_blank');
```

### `onGridSizeChange(newSize)`
Handler for grid size changes from GoogleMapView.

**Parameters:**
- `newSize` (number): New grid size

**Side Effects:**
- Updates `gridConfig.value.currentSize` if different

### `triggerStatisticsRefresh()`
Placeholder for future statistics refresh logic.

**Current Implementation:**
- Empty function (placeholder)

## Lifecycle Hooks

### `onMounted()`
- Calls `triggerStatisticsRefresh()` (placeholder)

### `onBeforeUnmount()`
- Clears `businessLoadTimer` if exists
- Clears `statsTimer` if exists (future use)

## Watchers

### `watch([gridConfig.value.currentSize, gridConfig.value.stepKm])`
Watches for grid configuration changes.

**Trigger:**
- When `gridConfig.currentSize` changes
- When `gridConfig.stepKm` changes

**Action:**
- Calls `triggerStatisticsRefresh()` (placeholder)

## Component Communication

### Props Passed to Children

**BusinessPanel:**
```javascript
:userPosition="userPosition"
:visibilityPercent="visibilityPercent"
:difficulty="difficulty"
:keywordsCount="keywords.length"
:competitors="competitors"
:isLoading="isLoadingBusinessData"
```

**GoogleMapView:**
```javascript
:gridConfig="gridConfig"
:refreshKey="mapRefreshKey"
```

### Events Received from Children

**GoogleMapView:**
- `@marker-selected="onMarkerSelected"`: When user clicks a map marker
- `@business-panel-open="onBusinessPanelOpen"`: When business panel opens
- `@grid-size-change="onGridSizeChange"`: When grid size changes

**BusinessPanel:**
- `@open-in-google="openInGoogle"`: When user clicks "Open in Google" button

## Mock Data Details

### Business Names
Hardcoded array of 10 business names:
- Dublin House Painters
- Pro Paint Solutions
- Emerald Painting Services
- Premier Decorators Dublin
- Colorful Homes Ireland
- Expert Paint & Decor
- Dublin Interior Design
- Quality Painters Ltd
- Perfect Finish Painting
- Dublin Exterior Experts

### Descriptions
Hardcoded array of 6 Polish descriptions for competitors.

### Street Names
Hardcoded array of 8 Dublin street names:
- O'Connell Street
- Grafton Street
- Dame Street
- Parnell Street
- Abbey Street
- Henry Street
- Talbot Street
- Capel Street

## Future Migration

### Planned Changes
1. **Grid Config**: Load from Convex `organizations.getCurrent` → `gridSettings`
2. **Keywords**: Load from Convex `keywords.getKeywords`
3. **Real Ranking Data**: Replace mock competitors with real data from keyword tracking
4. **Statistics**: Implement real statistics refresh logic

### Migration Steps
1. Add Convex subscription for organization data
2. Extract `gridSettings` from organization
3. Replace `useLocationData()` gridConfig with Convex data
4. Implement real competitor data fetching
5. Connect to keyword position tracking API

## Usage Example

```vue
<template>
  <LocationMapView />
</template>

<script setup>
import LocationMapView from '@/views/LocationMapView.vue';
</script>
```

**Note**: This component is typically used as a route component, not imported directly.

## Related Components

- `BusinessPanel.vue`: Left sidebar with business info
- `GoogleMapView.vue`: Main map visualization
- `useLocationData.js`: Mock data composable (to be replaced)

## Dependencies

- `vue`: Composition API, lifecycle hooks, watchers
- `BusinessPanel.vue`: Business info display
- `GoogleMapView.vue`: Map visualization
- `useLocationData.js`: Mock data composable
