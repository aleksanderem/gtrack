# Reviews Module

The **Reviews Module** (`/reviews`) is a comprehensive suite for managing customer feedback. It is a multi-tab interface.

## Architecture

### Container: `ReviewsDashboard.vue`
- **Role**: Layout manager, navigation, and global stats fetcher.
- **State**: Fetches `unreadReviewsCount` and `unreadInterceptedCount` periodically (every 30s) to update notification badges.
- **Access Control**: Uses `useFeatures` to lock tabs (e.g., "Auto-Reply") based on the user's plan.

## Sub-Views (Tabs)

### 1. Overview (`reviews-overview`)
*Displays high-level statistics.*
- **Data Source**: `ReviewsService.getStats()` (Mock).
- **Charts**:
    - Rating Distribution (Bar Chart).
    - Sentiment Analysis (Pie Chart).
    - Volume over time (Line Chart).

### 2. Reviews List (`reviews-list`)
*The main inbox for Google Reviews.*
- **Component**: `ReviewsList.vue`
- **Data**: `ReviewsService.getReviews()` (Mock).
- **Features**:
    - Filtering (Stars, Answered/Unanswered).
    - Reply Interface (Mock reply submission).

### 3. Acquisition (`reviews-acquisition`)
*Tools for generating physical marketing materials.*
- **Component**: `AcquisitionPanel.vue`
- **Features**:
    - **Graphics Generator**: Real-time preview of posters/cards. Uses CSS transforms to visualize dimensions.
    - **Landing Page Config**: Settings for the "Rate Us" page (QR destination).
- **State**: Local `ref` state for settings (colors, texts), not yet persisted to backend.

### 4. Intercepted (`reviews-intercepted`)
*Private feedback that didn't meet the star threshold.*
- **Data**: `ReviewsService.getInternalFeedbacks()` (Mock).
- **Limits**: Enforced by `maxInterceptedPerMonth`.

### 5. Auto-Reply (`reviews-auto-reply`)
*AI automation settings.*
- **Component**: `AutoReplySettings.vue`
- **Data**: `ReviewsService.getAutoReplySettings()` (Mock).
- **Limits**: Enforced by `maxAutoRepliesPerMonth`.

## Data Flow (Current)

Currently, the entire Reviews module relies on `src/services/ReviewsService.js`, which returns static mock data.
**There is NO connection to Convex for reviews yet.**

### Future Migration
1.  Create `reviews` table in Convex.
2.  Create `review_templates` table.
3.  Migrate `ReviewsService` methods to Convex Queries/Mutations.
