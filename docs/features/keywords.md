# Keyword Tracking

The Keyword Tracking feature allows users to monitor their ranking for specific search phrases in Google Maps and Search.

## Core Functionality

### 1. Managing Keywords
Users can add and remove keywords via the **Keywords Settings** panel (`src/components/gtrack/settings/KeywordsSettings.vue`).

- **Adding**: Calls `keywords.addKeyword` mutation.
- **Removing**: Calls `keywords.removeKeyword` mutation.
- **Listing**: Subscribes to `keywords.getKeywords` query.

### 2. Keyword Suggestions
To help users get started, we fetch suggested keywords based on their website content.

1.  User runs an **On-Page Audit**.
2.  The backend triggers a DataForSEO task (`keywords_data/google_ads/keywords_for_site/live`).
3.  Results are stored in the audit record.
4.  The frontend displays these suggestions as clickable tags.

### 3. Limits & Quotas
Keyword usage is strictly limited by the organization's plan.

- **Basic**: 10 Keywords
- **Professional**: 50 Keywords
- **Enterprise**: 1000 Keywords

**Enforcement**:
The `addKeyword` mutation calls `checkLimit` before inserting. If the limit is reached, it throws a `LimitExceededError`.
The frontend also displays a progress bar (`LimitProgressBar.vue`) and disables the "Add" button when full.
