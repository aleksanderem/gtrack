# LocationSettingsView Component

**File**: `src/views/LocationSettingsView.vue`  
**Route**: `/settings` (for `/:locationId`)  
**Purpose**: Settings page for configuring organization settings, business profile, keywords, grid, and feature flags

## Overview

`LocationSettingsView` is the central settings page where users configure all aspects of their location/organization. It manages multiple tabs of settings and synchronizes data with the Convex backend in real-time.

## Component Structure

```
LocationSettingsView.vue
├── Header (Save/Cancel buttons)
└── SettingsLayout
    ├── SettingsNavigation (Tab navigation)
    └── [Tab Content]
        ├── BusinessSettings (Tab: 'business')
        ├── GridConfiguration (Tab: 'scanning')
        ├── KeywordsSettings (Tab: 'keywords')
        ├── FrequencySettings (Tab: 'frequency')
        └── NotificationSettings (Tab: 'notifications')
```

## Props

None (this is a route component)

## Events

None (doesn't emit events to parent)

## Data Sources

### Convex Backend (Real-time)
- **Organization Data**: `convex.onUpdate(api.organizations.getCurrent)`
  - Subscribes to organization data
  - Updates automatically when database changes

### Local State
- **Settings Tabs**: Managed locally with `settingsTab` ref
- **Form Data**: Collected from child components before save

## State Management

### Local State
```javascript
const orgData = ref(null);              // Current organization from Convex
const settingsTab = ref('business');    // Active tab ID
const isSaving = ref(false);            // Saving state
const businessConfig = ref({            // Business configuration
  placeId: '',
  cid: '',
  isConnected: false,
  website: '',
  autoReply: false,
  photoMonitoring: true,
  postPublishing: false,
  dataProtection: true,
  qaMonitoring: false,
  hoursSync: false
});
```

### Composables Used
- `useLocationData()`: Provides `location`, `keywords`, `gridConfig` (mock data)
- `useFeatureSettings()`: Provides `featureSettings` store

### Stores Used
- `featureSettings`: Pinia store for feature flags

### Convex Subscriptions
- `api.organizations.getCurrent`: Real-time organization data

## Methods

### `cancelSettings()`
Cancels settings changes and navigates back to map view.

**Implementation:**
```javascript
router.push({ name: 'map' });
```

### `saveSettings()`
Saves all settings to Convex backend.

**Flow:**
1. Validates `orgData.value` exists
2. Sets `isSaving.value = true`
3. Collects data from all tabs:
   - `businessProfile`: From `businessConfig`
   - `gridSettings`: From `gridConfig`
   - `featureFlags`: From `businessConfig`
4. Calls `convex.mutation(api.organizations.updateSettings, {...})`
5. Shows success/error toast
6. Sets `isSaving.value = false`

**Mutation Parameters:**
```typescript
{
  orgId: Id<"organizations">,
  businessProfile?: {
    placeId?: string,
    cid?: string,
    isConnected?: boolean
  },
  gridSettings?: {
    maxSize: number,
    stepKm: number,
    centerName: string,
    centerLat?: number,
    centerLng?: number
  },
  featureFlags?: {
    autoReply: boolean,
    photoMonitoring: boolean,
    postPublishing: boolean,
    dataProtection: boolean,
    qaMonitoring: boolean,
    hoursSync: boolean
  }
}
```

**Error Handling:**
- Catches errors and shows error toast
- Logs error to console

### `handleLocationSearch(query)`
Handles location search for grid center point.

**Parameters:**
- `query` (string): Search query

**Implementation:**
- Mock geocoding logic
- Sets `gridConfig` center coordinates for known cities:
  - "warszawa" / "warsaw" → Warsaw coordinates
  - "london" → London coordinates
  - Otherwise → Sets `centerName` to query

**Future**: Should integrate with Google Places API

## Lifecycle Hooks

### `onMounted()`
- Subscribes to `api.organizations.getCurrent`
- Stores unsubscribe function in `unsubscribeOrg`

### `onUnmounted()`
- Unsubscribes from Convex query
- Cleans up subscription

## Watchers

### `watch(orgData, (org) => {...})`
Watches for organization data changes from Convex.

**Trigger:**
- When `orgData.value` changes (from Convex subscription)

**Actions:**
1. Updates `businessConfig.website` from `org.website`
2. Updates `businessConfig` from `org.businessProfile`
3. Updates `gridConfig` from `org.gridSettings`
4. Updates `businessConfig` and `featureSettings` from `org.featureFlags`

**Two-way Sync:**
- Updates both local `businessConfig` and global `featureSettings` store

### `watch(() => featureSettings.value, (newSettings) => {...})`
Watches for feature settings changes from global store.

**Trigger:**
- When `featureSettings` store changes

**Action:**
- Syncs `businessConfig` with store values (two-way binding)

**Deep Watch:**
- Uses `{ deep: true }` to watch nested objects

### `watch(() => route.query.highlight, async (highlight) => {...})`
Watches for `highlight` query parameter.

**Purpose:**
- Scrolls to specific feature card when navigating from locked feature

**Flow:**
1. Sets `settingsTab.value = 'business'`
2. Waits for next tick
3. Finds element with `data-feature-key="${highlight}"`
4. Scrolls to element smoothly
5. Removes `highlight` from URL query

**Use Case:**
- User clicks locked feature → navigates to settings → scrolls to feature card

### `watch(() => route.query.tab, (tab) => {...})`
Watches for `tab` query parameter.

**Purpose:**
- Sets active tab from URL query parameter

**Action:**
- If tab exists in `settingsNavItems`, sets `settingsTab.value = tab`

## Settings Tabs

### Tab Configuration
```javascript
const settingsNavItems = [
  {
    id: 'business',
    label: 'Ustawienia wizytówki',
    description: 'Identyfikacja i integracja Google',
    icon: 'pi pi-briefcase'
  },
  {
    id: 'scanning',
    label: 'Ustawienia skanowania',
    description: 'Siatka, odstępy i punkt centralny',
    icon: 'pi pi-th-large'
  },
  {
    id: 'keywords',
    label: 'Słowa kluczowe',
    description: 'Zarządzanie frazami do monitorowania',
    icon: 'pi pi-tags'
  },
  {
    id: 'frequency',
    label: 'Harmonogram',
    description: 'Częstotliwość i automatyzacja skanów',
    icon: 'pi pi-clock'
  },
  {
    id: 'notifications',
    label: 'Powiadomienia',
    description: 'Alerty e-mail i push',
    icon: 'pi pi-bell'
  }
];
```

### Tab Components

**BusinessSettings** (`settingsTab === 'business'`):
- Google Place ID and CID
- Website URL
- SEO Audit trigger
- Feature flags toggles

**GridConfiguration** (`settingsTab === 'scanning'`):
- Grid size (3x3 to 15x15)
- Step distance (km)
- Center point (name, lat, lng)
- Location search

**KeywordsSettings** (`settingsTab === 'keywords'`):
- Keyword list
- Add/remove keywords
- Limit checking
- Keyword suggestions from SEO audit

**FrequencySettings** (`settingsTab === 'frequency'`):
- Scanning schedule
- Frequency selection
- (Partially implemented)

**NotificationSettings** (`settingsTab === 'notifications'`):
- Email notifications
- SMS notifications
- (Placeholder)

## Data Synchronization

### Backend → Frontend
1. Convex subscription updates `orgData`
2. Watcher syncs `orgData` to local state:
   - `businessConfig` (business profile, website)
   - `gridConfig` (grid settings)
   - `featureSettings` store (feature flags)

### Frontend → Backend
1. User makes changes in child components
2. Changes stored in local state (`businessConfig`, `gridConfig`)
3. User clicks "Zapisz ustawienia"
4. `saveSettings()` collects all data
5. Single mutation saves all changes
6. Backend updates database
7. Subscription callback fires
8. UI updates automatically

### Two-way Sync (Feature Flags)
- Changes in `BusinessSettings` → Update `businessConfig` → Update `featureSettings` store
- Changes in `featureSettings` store → Update `businessConfig`
- On save → Both synced to backend

## Component Communication

### Props Passed to Children

**SettingsLayout:**
```javascript
v-model="settingsTab"
:items="settingsNavItems"
nav-title="Sekcje"
```

**BusinessSettings:**
```javascript
v-model="businessConfig"
```

**GridConfiguration:**
```javascript
v-model:gridSize="gridConfig.maxSize"
v-model:stepKm="gridConfig.stepKm"
v-model:centerName="gridConfig.centerName"
@search-location="handleLocationSearch"
```

**KeywordsSettings:**
```javascript
v-model:keywords="keywords"
:website="businessConfig.website"
```

**FrequencySettings & NotificationSettings:**
- No props (manage own state)

### Events Received from Children

**GridConfiguration:**
- `@search-location="handleLocationSearch"`: Location search query

## URL Query Parameters

### `?tab=<tabId>`
Sets active tab on mount.

**Example:**
- `/demo-location/settings?tab=keywords` → Opens Keywords tab

### `?highlight=<featureKey>`
Scrolls to feature card in Business Settings.

**Example:**
- `/demo-location/settings?highlight=autoReply` → Scrolls to auto-reply feature card

**Flow:**
1. User clicks locked feature elsewhere
2. Navigates to settings with `highlight` param
3. Component switches to 'business' tab
4. Scrolls to feature card
5. Removes param from URL

## Error Handling

### Save Errors
- Catches mutation errors
- Shows error toast: "Nie udało się zapisać ustawień"
- Logs error to console
- Resets `isSaving` state

### Subscription Errors
- Handled by Convex client automatically
- Reconnects automatically on network issues

## Usage Example

```vue
<template>
  <LocationSettingsView />
</template>

<script setup>
import LocationSettingsView from '@/views/LocationSettingsView.vue';
</script>
```

**Note**: This component is typically used as a route component.

## Related Components

- `SettingsLayout.vue`: Layout wrapper with navigation
- `SettingsNavigation.vue`: Tab navigation component
- `BusinessSettings.vue`: Business profile settings
- `GridConfiguration.vue`: Grid configuration
- `KeywordsSettings.vue`: Keywords management
- `FrequencySettings.vue`: Schedule settings
- `NotificationSettings.vue`: Notification settings

## Dependencies

- `vue`: Composition API, lifecycle hooks, watchers
- `vue-router`: Navigation, route params/query
- `primevue`: Button, Toast service
- `convex`: Backend client
- `useLocationData.js`: Mock data composable
- `featureSettings.js`: Pinia store
