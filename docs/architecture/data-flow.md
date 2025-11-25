# Data Flow Architecture

This document describes how data flows through the GTRACK application for each major module. Understanding these flows is critical for debugging, feature development, and system optimization.

## Overview

GTRACK uses a hybrid data architecture:
- **Real Backend (Convex)**: Settings, Keywords, SEO Audits
- **Mock Data**: Reviews, Map visualization, Traffic stats
- **Real-time Updates**: Convex subscriptions via `convex.onUpdate()`
- **Optimistic Updates**: UI updates immediately, syncs with backend

## Data Flow Patterns

### Pattern 1: Real-time Subscription (Convex)

```
Component Mount
    ↓
convex.onUpdate(query, args, callback)
    ↓
Convex Query Executes
    ↓
Database Returns Data
    ↓
Callback Fires → Update Local State
    ↓
UI Re-renders
    ↓
[Database Changes]
    ↓
Convex Detects Change
    ↓
Callback Fires Again → Update Local State
    ↓
UI Re-renders Automatically
```

### Pattern 2: Optimistic Update

```
User Action
    ↓
Update Local State Immediately (Optimistic)
    ↓
Show Loading State
    ↓
Call Mutation
    ↓
[Success] → Keep Optimistic State
[Error] → Rollback to Previous State
    ↓
Hide Loading State
```

### Pattern 3: Action (Long-Running Task)

```
User Action
    ↓
Show Loading State
    ↓
Call Action (async)
    ↓
Action Runs on Backend
    ├─ External API Call (DataForSEO)
    ├─ Polling for Results
    └─ Save to DB via Mutation
    ↓
Action Returns Result
    ↓
Update Local State
    ↓
Hide Loading State
    ↓
[Database Updated]
    ↓
Subscriptions Update Automatically
```

## Module-Specific Data Flows

### 1. Settings Module

**Location**: `LocationSettingsView.vue` → `BusinessSettings.vue`, `KeywordsSettings.vue`, etc.

#### Flow: Loading Settings

```
LocationSettingsView.vue (onMounted)
    ↓
convex.onUpdate(api.organizations.getCurrent, {}, callback)
    ↓
Convex Query: organizations.getCurrent
    ↓
Database: organizations table (first org)
    ↓
Callback: orgData.value = org
    ↓
Props Passed to Child Components
    ├─ BusinessSettings.vue (businessConfig)
    ├─ KeywordsSettings.vue (keywords via separate query)
    ├─ GridConfiguration.vue (gridConfig)
    └─ Other Settings Components
    ↓
UI Renders with Current Values
```

#### Flow: Saving Settings

```
User Clicks "Zapisz ustawienia"
    ↓
LocationSettingsView.saveSettings()
    ↓
Collect Data from All Tabs
    ├─ businessConfig (BusinessSettings)
    ├─ gridConfig (GridConfiguration)
    ├─ keywords (KeywordsSettings - separate mutations)
    └─ featureFlags (BusinessSettings)
    ↓
convex.mutation(api.organizations.updateSettings, {
    orgId: orgData._id,
    businessProfile: {...},
    gridSettings: {...},
    featureFlags: {...}
})
    ↓
Backend Mutation: organizations.updateSettings
    ↓
Database: organizations table (patch)
    ↓
[Database Updated]
    ↓
Convex Detects Change
    ↓
onUpdate Callback Fires
    ↓
orgData.value Updated
    ↓
Props Updated → Child Components Re-render
    ↓
UI Shows Success Toast
```

#### Flow: Keywords Management

**Adding a Keyword:**

```
KeywordsSettings.vue
    ↓
User Types Keyword → Clicks "Dodaj"
    ↓
Validate Input (non-empty)
    ↓
Check Limit: useFeatures().getLimit('keywords', 'maxKeywords')
    ↓
Check Current Count: keywords.length
    ↓
[If Limit Reached] → Show Error, Disable Button
[If OK] → Continue
    ↓
convex.mutation(api.keywords.addKeyword, { keyword })
    ↓
Backend: keywords.addKeyword
    ├─ Check Duplicate (by_org_keyword index)
    ├─ Count Current Keywords
    ├─ checkLimit(ctx, orgId, "maxKeywords", currentCount)
    └─ Insert New Keyword
    ↓
[If Limit Exceeded] → Throw Error → Show Toast
[If Success] → Continue
    ↓
[Database Updated]
    ↓
onUpdate(api.keywords.getKeywords) Callback Fires
    ↓
keywords.value Updated
    ↓
UI Updates (New Keyword Appears)
    ↓
Progress Bar Updates (if shown)
```

**Removing a Keyword:**

```
KeywordsSettings.vue
    ↓
User Clicks Delete Button
    ↓
Confirm Dialog (optional)
    ↓
convex.mutation(api.keywords.removeKeyword, { keyword })
    ↓
Backend: keywords.removeKeyword
    ├─ Find Keyword (by_org_keyword index)
    └─ Delete Document
    ↓
[Database Updated]
    ↓
onUpdate(api.keywords.getKeywords) Callback Fires
    ↓
keywords.value Updated (keyword removed)
    ↓
UI Updates (Keyword Disappears)
```

### 2. SEO Audits Module

**Location**: `BusinessSettings.vue` → `SeoService.js` → `convex/seo.ts`

#### Flow: Running an Audit

```
BusinessSettings.vue
    ↓
User Enters URL → Clicks "Skanuj stronę"
    ↓
Validate URL Format
    ↓
Show Loading State (BlockUI)
    ↓
SeoService.runAudit(url)
    ↓
[Check Cache]
    ├─ convex.query(api.seo.getAudit, { url, orgId })
    ├─ If exists and < 24h old → Return Cached
    └─ If not → Continue
    ↓
convex.action(api.seo.runAuditAction, { url, orgId })
    ↓
Backend Action: seo.runAuditAction
    ├─ Create Pending Audit Record (optional)
    ├─ POST to DataForSEO: v3/on_page/task_post
    ├─ Get taskId
    ├─ Poll: v3/on_page/summary/{taskId} (every 3s, max 30 attempts)
    ├─ Fetch Details: v3/on_page/pages
    ├─ Fetch Keywords: v3/keywords_data/google_ads/keywords_for_site/live
    └─ Save Result: ctx.runMutation(api.seo.saveAuditResult, {...})
    ↓
[Database Updated: seoAudits table]
    ↓
Action Returns Result Object
    ↓
SeoService Returns Result
    ↓
BusinessSettings Displays Results
    ├─ Show Score
    ├─ Show Issues (High/Medium/Low)
    ├─ Show Keyword Suggestions
    └─ Hide Loading State
    ↓
[Optional] onUpdate(api.seo.getAudit) Updates Cache
```

#### Flow: Displaying Audit Results

```
BusinessSettings.vue
    ↓
Component Mounts or URL Changes
    ↓
convex.query(api.seo.getAudit, { url, orgId })
    ↓
Backend Query: seo.getAudit
    ↓
Database: seoAudits table (by_org_url index)
    ↓
Returns Audit Document (or null)
    ↓
If Audit Exists:
    ├─ Display Score
    ├─ Display Issues
    └─ Show "Ostatni audit" Section
    ↓
If No Audit:
    └─ Show "Brak audytu" Message
```

### 3. Reviews Module

**Location**: `ReviewsDashboard.vue` → `ReviewsList.vue`, `ReviewsOverview.vue`, etc.

**Status**: Currently uses **Mock Data** via `ReviewsService.js`. Future migration to Convex planned.

#### Flow: Loading Reviews List

```
ReviewsList.vue (onMounted)
    ↓
fetchReviews()
    ↓
ReviewsService.getReviews({ status, sort })
    ↓
[Mock Service] Returns Static Data
    ├─ Filter by status (all/unanswered/answered)
    ├─ Sort by sort (newest/lowest)
    └─ Simulate Delay (600ms)
    ↓
reviews.value = data
    ↓
UI Renders Review Items
```

#### Flow: Replying to a Review

```
ReviewItem.vue
    ↓
User Types Reply → Clicks "Wyślij"
    ↓
Validate Reply (non-empty)
    ↓
Show Loading State
    ↓
ReviewsService.replyToReview(reviewId, message)
    ↓
[Mock Service] Updates Local Mock Data
    ├─ Mark as answered
    ├─ Set reply text
    └─ Simulate Delay (500ms)
    ↓
Emit 'replied' Event with Updated Review
    ↓
ReviewsList.handleReplyUpdate(updatedReview)
    ├─ Update Local State
    └─ If 'unanswered' filter → Remove from list (with delay)
    ↓
UI Updates (Review Shows Reply)
```

#### Flow: Loading Reviews Stats

```
ReviewsOverview.vue
    ↓
Component Mounts
    ↓
ReviewsService.getStats()
    ↓
[Mock Service] Returns Mock Statistics
    ├─ Total reviews
    ├─ Average rating
    ├─ Rating distribution
    ├─ Sentiment analysis
    └─ Volume over time
    ↓
stats.value = data
    ↓
ReviewsStats Component Renders Charts
    ├─ Rating Distribution (Bar Chart)
    ├─ Sentiment Analysis (Pie Chart)
    └─ Volume Over Time (Line Chart)
```

**Future Flow (Convex Migration):**

```
ReviewsDashboard.vue
    ↓
convex.onUpdate(api.reviews.getReviews, { orgId }, callback)
    ↓
Convex Query: reviews.getReviews
    ↓
Database: reviews table (by_org index)
    ↓
Callback: reviews.value = data
    ↓
UI Updates Automatically
```

### 4. Map View Module

**Location**: `LocationMapView.vue` → `GoogleMapView.vue`

**Status**: Currently uses **Mock Data** via `useLocationData.js`. Grid config comes from Convex.

#### Flow: Loading Map View

```
LocationMapView.vue (onMounted)
    ↓
useLocationData() - Mock Data
    ├─ location (hardcoded)
    ├─ keywords (hardcoded)
    ├─ gridConfig (from Convex in future)
    └─ trafficSummary (hardcoded)
    ↓
[Future] convex.onUpdate(api.organizations.getCurrent, {}, callback)
    ↓
[Future] Extract gridSettings from org
    ↓
Pass gridConfig to GoogleMapView
    ↓
GoogleMapView Initializes Leaflet Map
    ├─ Create Map Instance
    ├─ Calculate Grid Points
    ├─ Render Grid Circles
    └─ Add Markers with Clustering
    ↓
UI Renders Map
```

#### Flow: Grid Configuration Change

```
GridConfiguration.vue (in Settings)
    ↓
User Changes Grid Size or Step
    ↓
Update Local State (v-model)
    ↓
Emit 'update:gridSize' or 'update:stepKm'
    ↓
LocationSettingsView Updates gridConfig
    ↓
[On Save] → convex.mutation(api.organizations.updateSettings, { gridSettings })
    ↓
[Database Updated]
    ↓
[Future] onUpdate Callback Fires
    ↓
[Future] LocationMapView Receives New gridConfig
    ↓
[Future] GoogleMapView Re-renders Grid
```

#### Flow: Marker Selection

```
GoogleMapView.vue
    ↓
User Clicks Map Marker
    ↓
Leaflet Click Event Handler
    ↓
Emit 'marker-selected' Event with Ranking Data
    ↓
LocationMapView.onMarkerSelected(ranking)
    ↓
Update Local State
    ├─ selectedRanking = ranking
    ├─ userPosition = ranking
    └─ visibilityPercent = calculateVisibility(ranking)
    ↓
generateBusinessListings(ranking)
    ↓
[Mock] Create Competitor List
    ├─ Random business names
    ├─ Random ratings
    └─ Simulate Delay (900ms)
    ↓
competitors.value = listings
    ↓
BusinessPanel Receives Props
    ↓
UI Updates (Competitor List, Visibility Score)
```

### 5. Feature Flags & Limits

**Location**: Throughout app via `useFeatures()` composable

#### Flow: Checking Feature Availability

```
Component
    ↓
const { can } = useFeatures()
    ↓
can('autoReply')
    ↓
useFeatures.can()
    ├─ Get Feature from FEATURES config
    ├─ Check Debug Bar Override (localStorage)
    ├─ Get Required Plan
    ├─ Get Current Plan (from store)
    └─ Compare Plan Levels
    ↓
Returns: true/false
    ↓
Component Uses Result
    ├─ v-if="can('autoReply')" → Show Feature
    └─ :disabled="!can('autoReply')" → Disable Button
```

#### Flow: Checking Limits

```
Component (e.g., KeywordsSettings)
    ↓
const { getLimit, getLimitStatus } = useFeatures()
    ↓
getLimit('keywords', 'maxKeywords')
    ↓
useFeatures.getLimit()
    ├─ Get Feature from FEATURES config
    ├─ Check Debug Bar Override (localStorage)
    ├─ Get Current Plan (from store)
    └─ Return Limit Value
    ↓
Compare: keywords.length >= limit
    ↓
If Limit Reached:
    ├─ Disable "Add" Button
    ├─ Show Progress Bar (100%)
    └─ Show Warning Message
    ↓
If Not Reached:
    ├─ Enable "Add" Button
    ├─ Show Progress Bar (current/limit)
    └─ Show Remaining Count
```

## Real-time Updates

### How `convex.onUpdate` Works

```javascript
// Component subscribes
const unsubscribe = convex.onUpdate(
  api.keywords.getKeywords,  // Query function
  {},                        // Query arguments
  (keywords) => {            // Callback
    localKeywords.value = keywords;
  }
);

// When database changes:
// 1. Convex detects change in 'keywords' table
// 2. Re-runs query automatically
// 3. Compares result with previous result
// 4. If different, calls callback with new data
// 5. Component updates automatically

// Cleanup
onUnmounted(() => {
  unsubscribe(); // Stops subscription
});
```

### Subscription Lifecycle

```
Component Mounts
    ↓
onMounted() Hook
    ↓
convex.onUpdate(...) Called
    ↓
Subscription Created
    ↓
Query Executes Immediately
    ↓
Callback Fires with Initial Data
    ↓
[Component Active]
    ↓
[Database Changes]
    ↓
Query Re-executes
    ↓
Callback Fires with New Data
    ↓
[Repeat...]
    ↓
Component Unmounts
    ↓
onUnmounted() Hook
    ↓
unsubscribe() Called
    ↓
Subscription Removed
```

## Optimistic Updates

### When to Use

- **Fast Operations**: Mutations that complete quickly (< 500ms)
- **User Feedback**: Immediate UI response improves UX
- **Rollback Capable**: Operations that can be easily undone

### Example: Adding Keyword (Optimistic)

```javascript
const addKeyword = async (keyword) => {
  // 1. Optimistic: Add to local state immediately
  const tempKeyword = {
    _id: `temp-${Date.now()}`,
    keyword,
    createdAt: Date.now()
  };
  localKeywords.value.push(tempKeyword);
  
  try {
    // 2. Real: Sync with backend
    await convex.mutation(api.keywords.addKeyword, { keyword });
    
    // 3. Success: Temporary ID will be replaced by real data via subscription
    // Subscription callback will update with real document
  } catch (error) {
    // 4. Error: Rollback
    const index = localKeywords.value.findIndex(k => k._id === tempKeyword._id);
    if (index !== -1) {
      localKeywords.value.splice(index, 1);
    }
    showError(error.message);
  }
};
```

## Cache Strategy

### Convex Query Cache

- **Automatic**: Convex caches query results automatically
- **Invalidation**: Cache invalidates when data changes
- **Real-time**: Changes propagate immediately to all subscribers

### Local Cache (localStorage)

**Feature Settings Store:**
```javascript
// Save to localStorage
localStorage.setItem('featureSettings', JSON.stringify(settings));

// Load from localStorage
const saved = localStorage.getItem('featureSettings');
```

**Cached Data:**
- Feature flags enabled/disabled
- Subscription plan
- Usage tracking (mock)
- Debug bar overrides

### SEO Audit Cache

**Strategy:**
```javascript
// Check cache before running new audit
const cached = await convex.query(api.seo.getAudit, { url, orgId });

if (cached && cached.status === 'completed' && 
    (Date.now() - cached.createdAt < 1000 * 60 * 60 * 24)) {
  // Use cached result if < 24 hours old
  return cached.fullResult;
}

// Otherwise, run new audit
```

## Error Handling Flows

### Mutation Errors

```
User Action
    ↓
convex.mutation(...)
    ↓
[Error Occurs]
    ├─ Limit Exceeded
    ├─ Validation Error
    └─ Network Error
    ↓
Error Thrown
    ↓
try/catch in Component
    ↓
Show Error Toast
    ↓
[If Optimistic] → Rollback State
```

### Action Errors

```
User Action
    ↓
convex.action(...)
    ↓
[Error Occurs]
    ├─ External API Error (DataForSEO)
    ├─ Timeout
    └─ Network Error
    ↓
Error Thrown
    ↓
try/catch in Component
    ↓
Show Error Toast
    ↓
Hide Loading State
```

### Subscription Errors

```
Component Subscribes
    ↓
convex.onUpdate(...)
    ↓
[Connection Lost]
    ↓
Convex Client Handles Reconnection
    ↓
[Reconnection Successful]
    ↓
Query Re-executes
    ↓
Callback Fires with Latest Data
```

## Data Synchronization

### Multi-Component Updates

When data changes in one component, all subscribed components update automatically:

```
Component A: KeywordsSettings
    ↓
User Adds Keyword
    ↓
Mutation: addKeyword
    ↓
Database Updated
    ↓
Convex Detects Change
    ↓
All Subscribers Update:
    ├─ Component A: KeywordsSettings (via onUpdate)
    ├─ Component B: Sidebar KeywordsManager (via onUpdate)
    └─ Component C: Settings Navigation (via onUpdate)
```

### Cross-Module Updates

```
Settings Module: Update gridSettings
    ↓
Database Updated
    ↓
Map View Module: Receives Update (via onUpdate)
    ↓
GoogleMapView: Re-renders Grid
```

## Future Migration Flows

### Reviews: Mock → Convex

**Current:**
```
ReviewsList → ReviewsService.getReviews() → Mock Data
```

**Future:**
```
ReviewsList → convex.onUpdate(api.reviews.getReviews) → Convex Query → Database
```

### Map: Mock → Convex

**Current:**
```
LocationMapView → useLocationData() → Mock Data
```

**Future:**
```
LocationMapView → convex.onUpdate(api.organizations.getCurrent) → Extract gridSettings
```

## Performance Considerations

### Subscription Optimization

- **Unsubscribe**: Always unsubscribe in `onUnmounted` to prevent memory leaks
- **Selective Subscriptions**: Only subscribe to data needed by component
- **Query Arguments**: Use specific arguments to limit data returned

### Update Batching

- **Convex Automatic**: Convex batches updates automatically
- **Vue Reactivity**: Vue batches DOM updates for performance
- **Manual Batching**: Use `nextTick()` if needed for sequential updates

### Data Minimization

- **Denormalization**: Store frequently accessed fields (score, metaTitle) at top level
- **Pagination**: For large lists, implement pagination (future)
- **Lazy Loading**: Load data only when component is visible (future)
