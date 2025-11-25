# Review Management

The Reviews module allows businesses to aggregate, view, and reply to Google Reviews from a single dashboard.

## Components

### `ReviewsDashboard.vue`
The main container. Displays a list of reviews and summary statistics.

### `ReviewItem.vue`
Displays a single review card with:
- Star rating
- Review text
- Author info
- **Reply Interface**: Allows the user to draft and send a reply.

### `ResponseTemplates.vue`
Allows users to create and manage saved replies (templates) for quick responses.

## AI Auto-Reply (Feature Gated)

**Availability**: Professional & Enterprise plans only.

When enabled, the system can automatically generate draft replies or (in Enterprise) auto-publish replies to new reviews.
- **Configuration**: Managed in `AutoReplySettings.vue`.
- **Logic**: Uses an LLM (via Convex Action) to analyze the review sentiment and generate a context-aware response.
