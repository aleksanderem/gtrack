# Settings Module

The **Settings Module** (`/settings`) is the control center for the location configuration. Unlike other parts of the app, this module is **fully integrated with the Convex backend**.

## Architecture

### Container: `LocationSettingsView.vue`
- **Role**: State orchestrator.
- **Data Fetching**:
    - `convex.onUpdate(api.organizations.getCurrent)`: Fetches the entire org configuration.
    - **Sync**: Propagates this data down to child components via props.
- **Data Saving**:
    - `saveSettings()`: Calls `convex.mutation(api.organizations.updateSettings)` to persist changes from all tabs at once.

## Tabs Breakdown

### 1. Business Profile (`BusinessSettings.vue`)
*Manages the Google Business Profile connection.*
- **Data**: `org.businessProfile`
- **Key Features**:
    - **Website URL**: Editable field.
    - **SEO Audit**: "Skanuj stronę" button triggers `seo.runAuditAction`.
    - **Audit History**: Displays the last audit result (Score, Issues).

### 2. Keywords (`KeywordsSettings.vue`)
*Manages monitored search phrases.*
- **Data**: `keywords` table (fetched via `api.keywords.getKeywords`).
- **Interaction**:
    - **Add**: Calls `api.keywords.addKeyword` (Enforces limits).
    - **Remove**: Calls `api.keywords.removeKeyword`.
    - **Suggestions**: Fetched from the last SEO Audit result.

### 3. Scanning Configuration (`GridConfiguration.vue`)
*Controls the map grid parameters.*
- **Data**: `org.gridSettings`
- **Fields**:
    - **Grid Size**: 3x3 to 15x15.
    - **Radius**: Distance between points (km).
    - **Center Point**: Lat/Lng (currently manual or mock).

### 4. Frequency (`FrequencySettings.vue`)
*Schedules for automated scanning.*
- **Data**: `org.settings` (Partially implemented).
- **Logic**: UI allows selecting days/times, but the backend scheduler is not yet active.

### 5. Notifications (`NotificationSettings.vue`)
*Email and SMS alert preferences.*
- **Data**: `org.settings.notifications` (Mock/Placeholder).
