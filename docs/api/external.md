# External Integrations

## DataForSEO

We use DataForSEO for all search intelligence data.

### Endpoints Used

#### On-Page API
- **Endpoint**: `v3/on_page/task_post`
- **Purpose**: Analyze technical SEO and content of the user's website.
- **Usage**: Called when user clicks "Skanuj stronę" in Business Settings.

#### Keywords Data API
- **Endpoint**: `v3/keywords_data/google_ads/keywords_for_site/live`
- **Purpose**: Generate keyword suggestions based on the website content.
- **Usage**: Automatically called after a successful On-Page audit to populate the "Suggested Keywords" list.

## Google Maps Platform

- **Places API**: Used for the "Google Place ID" autocomplete search.
- **Maps JavaScript API**: Renders the grid visualization in Location Settings.
