# Architecture Overview

## Technology Stack

### Frontend
- **Framework**: Vue 3.4.21 (Composition API with `<script setup>`)
- **Build Tool**: Vite 5.1.6
- **UI Library**: PrimeVue 4.0.7 (Unstyled mode with Tailwind presets)
- **Styling**: Tailwind CSS 4.0.0
- **State Management**: 
  - Pinia (for global feature flags and subscription state)
  - Vue Reactivity (for component-local state)
  - Convex Reactivity (for real-time backend data)
- **Routing**: Vue Router 4.6.3
- **Maps**: Leaflet 1.9.4 with MarkerCluster 1.5.3
- **Charts**: Chart.js 4.5.1
- **Icons**: PrimeIcons 6.0.1
- **Utilities**: 
  - @vueuse/core 14.0.0
  - @vueuse/integrations 14.0.0
  - qrcode 1.5.4

### Backend
- **Platform**: [Convex](https://convex.dev) 1.29.3 (Backend-as-a-Service)
- **Database**: Real-time document database (MongoDB-compatible)
- **Functions**: Serverless TypeScript functions
  - **Queries**: Read-only, reactive subscriptions
  - **Mutations**: Write operations with automatic reactivity
  - **Actions**: Async operations (external API calls, long-running tasks)

### External Services
- **DataForSEO**: Provides SEO metrics, keyword data, and SERP results via REST API
- **Google Maps Platform**: 
  - Places API (autocomplete, place details)
  - Maps JavaScript API (map visualization)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vue 3)                     │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (PrimeVue Components)                             │
│  ├── Views (LocationMapView, LocationSettingsView, etc.)   │
│  ├── Components (Reviews, Settings, Map, etc.)            │
│  └── Common (LimitProgressBar, FeatureLicenseBadge, etc.)   │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer                                      │
│  ├── Pinia Store (featureSettings.js)                      │
│  ├── Composables (useFeatures, useLocationData, etc.)     │
│  └── Convex Reactivity (convex.onUpdate)                   │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  ├── ReviewsService.js (Mock)                               │
│  ├── SeoService.js (Convex integration)                    │
│  └── KeywordsService.js (Mock)                              │
├─────────────────────────────────────────────────────────────┤
│  API Client Layer                                            │
│  └── Convex Client (convex.js)                             │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Convex)                          │
├─────────────────────────────────────────────────────────────┤
│  Functions Layer                                             │
│  ├── Queries (getCurrent, getKeywords, getAudit)           │
│  ├── Mutations (updateSettings, addKeyword, etc.)         │
│  └── Actions (runAuditAction - DataForSEO integration)    │
├─────────────────────────────────────────────────────────────┤
│  Database Layer                                              │
│  ├── organizations (multi-tenant root)                      │
│  ├── users (organization members)                          │
│  ├── keywords (monitored search phrases)                   │
│  ├── seoAudits (audit history and results)                 │
│  └── featureUsage (usage tracking for limits)               │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│              External Services                                │
│  ├── DataForSEO API (SEO audits, keyword suggestions)     │
│  └── Google Maps Platform (Places, Maps)                   │
└─────────────────────────────────────────────────────────────┘
```

## Application Layers

### 1. UI Layer
- **Views**: Top-level route components (`LocationMapView.vue`, `LocationSettingsView.vue`, `ReviewsDashboard.vue`)
- **Components**: Reusable UI components organized by domain (`reviews/`, `settings/`, `map/`, `common/`)
- **Layouts**: Application shell (`DashboardLayout.vue`) with navigation and sidebars

### 2. State Management Layer
Three complementary approaches:

**Pinia Store** (`featureSettings.js`):
- Global subscription state (plan, limits)
- Feature flags enabled/disabled state
- Usage tracking
- Persisted to localStorage

**Composables** (`useFeatures.js`, `useLocationData.js`, etc.):
- Encapsulate domain-specific logic
- Provide reactive helpers
- Can use stores or Convex directly

**Convex Reactivity**:
- Direct subscription to backend data via `convex.onUpdate()`
- Automatic UI updates when database changes
- No manual store synchronization needed

### 3. Services Layer
- **Mock Services**: `ReviewsService.js`, `KeywordsService.js` - provide static data during development
- **Real Services**: `SeoService.js` - wraps Convex actions for SEO audits

### 4. API Client Layer
- **Convex Client**: Singleton instance (`convex.js`) connecting to Convex backend
- Handles authentication, WebSocket connections, and request/response

### 5. Backend Functions Layer
- **Queries**: Fast, read-only operations that can be subscribed to
- **Mutations**: Write operations that trigger reactive updates
- **Actions**: Async operations for external API calls (DataForSEO)

### 6. Database Layer
- Document-based schema with indexes for efficient queries
- Multi-tenant architecture (organizations as root entity)
- Real-time updates propagate automatically

## Design Principles

### Multi-Tenant Architecture
- **Organization** is the root entity
- All data is scoped to `orgId`
- Users belong to organizations with roles (admin/member)
- Future: Proper authentication and authorization per organization

### Real-Time First
- Frontend subscribes to Convex queries using `convex.onUpdate()`
- Database changes automatically propagate to all connected clients
- No manual polling or refresh needed
- Optimistic updates for better UX

### Serverless & Scalable
- Convex handles scaling automatically
- Functions are stateless and can scale horizontally
- No server management required

### Progressive Migration
- System is in hybrid state: some features use real backend (Settings, Keywords, SEO), others use mocks (Reviews, Map visualization)
- Clear migration path documented in `data-evolution.md`
- Mock services can be replaced incrementally

## Data Flow Patterns

### 1. Real-Time Subscription Pattern
```javascript
// Component subscribes to Convex query
onMounted(() => {
  unsubscribe = convex.onUpdate(api.keywords.getKeywords, {}, (keywords) => {
    localKeywords.value = keywords;
  });
});

onUnmounted(() => {
  unsubscribe(); // Clean up subscription
});
```
- Query runs automatically when component mounts
- Updates automatically when database changes
- Unsubscribes when component unmounts

### 2. Optimistic Update Pattern
```javascript
// Update UI immediately, then sync with backend
const addKeyword = async (keyword) => {
  // Optimistic: add to local state
  localKeywords.value.push({ keyword, createdAt: Date.now() });
  
  try {
    // Real: sync with backend
    await convex.mutation(api.keywords.addKeyword, { keyword });
  } catch (error) {
    // Rollback on error
    localKeywords.value.pop();
    showError(error);
  }
};
```

### 3. Action Pattern (Long-Running Tasks)
```javascript
// Trigger async action (e.g., SEO audit)
const runAudit = async (url) => {
  loading.value = true;
  try {
    // Action runs on backend, may take time
    const result = await convex.action(api.seo.runAuditAction, {
      url,
      orgId: org._id
    });
    // Result is automatically saved to DB via mutation
    // UI updates via subscription
  } finally {
    loading.value = false;
  }
};
```

## Request Flow: UI to Database

### Example: Adding a Keyword

1. **User Action**: User types keyword and clicks "Add" in `KeywordsSettings.vue`
2. **Component Logic**: 
   - Validates input
   - Checks limits using `useFeatures().getLimit()`
   - Shows loading state
3. **API Call**: `convex.mutation(api.keywords.addKeyword, { keyword })`
4. **Backend Mutation** (`keywords.ts`):
   - Validates keyword doesn't exist
   - Checks plan limits via `checkLimit()`
   - Inserts into `keywords` table
5. **Database Update**: New document created in `keywords` collection
6. **Reactive Update**: All subscribers to `getKeywords` query receive update
7. **UI Update**: Component's `convex.onUpdate` callback fires, updating local state
8. **Visual Feedback**: Loading state cleared, keyword appears in list

### Example: SEO Audit (Action Flow)

1. **User Action**: User clicks "Skanuj stronę" in `BusinessSettings.vue`
2. **Service Call**: `SeoService.runAudit(url)`
3. **Action Trigger**: `convex.action(api.seo.runAuditAction, { url, orgId })`
4. **Backend Action** (`seo.ts`):
   - Creates pending audit record in DB
   - Calls DataForSEO API (POST task)
   - Polls for results (up to 30 attempts)
   - Fetches detailed page data
   - Fetches keyword suggestions
   - Calls mutation to save results
5. **Database Update**: `seoAudits` table updated with results
6. **Reactive Update**: UI automatically updates via subscription
7. **Display**: Results shown in `SeoAuditDialog.vue`

## Design Patterns Used

### 1. Composition API Pattern
- All components use `<script setup>` for better performance
- Logic organized in composables for reusability
- Clear separation of concerns

### 2. Feature Flag Pattern
- Centralized feature configuration in `src/config/features.js`
- Runtime checking via `useFeatures().can()`
- Debug bar allows override for testing

### 3. Limit Enforcement Pattern
- Limits defined in config
- Frontend checks proactively (UX)
- Backend validates strictly (security)
- Usage tracked in `featureUsage` table

### 4. Mock-to-Real Migration Pattern
- Mock services provide same interface as real services
- Components don't need to change when migrating
- Clear status tracking in `data-evolution.md`

### 5. Multi-Tenant Isolation Pattern
- All queries filter by `orgId`
- Organization context fetched once per request
- Future: Proper auth context per request

## Technology Decisions & Rationale

### Why Convex?
- **Real-time**: Automatic reactivity without manual WebSocket management
- **Type-safe**: Generated TypeScript types from schema
- **Serverless**: No infrastructure management
- **Fast development**: Schema changes auto-sync

### Why PrimeVue Unstyled?
- **Flexibility**: Full control over styling with Tailwind
- **Functionality**: Complex components (DataTable, Dialog) without opinionated styles
- **Consistency**: Can match design system exactly

### Why Vue 3 Composition API?
- **Better TypeScript support**: Easier type inference
- **Better code organization**: Logic grouped by concern, not lifecycle
- **Better performance**: Tree-shaking, smaller bundle

### Why Hybrid State Management?
- **Pinia**: Global app state (subscription, feature flags) that doesn't come from backend
- **Composables**: Reusable logic that may use stores or Convex
- **Convex Reactivity**: Backend data that should stay in sync automatically

## Known Limitations & Future Considerations

### Current Limitations
1. **Mock Data**: Reviews and Map visualization still use mocks
2. **Auth Simplification**: Single organization hardcoded for development
3. **No Offline Support**: Requires active connection to Convex
4. **Limited Error Recovery**: Basic error handling, could be more robust

### Future Considerations
1. **Full Auth Integration**: Clerk/Auth0 with proper multi-tenant isolation
2. **Offline Support**: Service workers, local caching
3. **Advanced Analytics**: Usage tracking, performance monitoring
4. **Background Jobs**: Scheduled tasks (keyword scanning, report generation)
5. **Webhooks**: External integrations (Slack, email notifications)
