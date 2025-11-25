# External Integrations

Complete documentation for all external API integrations used by GTRACK.

## DataForSEO Integration

DataForSEO provides SEO metrics, keyword data, and SERP results. We use their REST API for on-page audits and keyword research.

### Authentication

**Method**: Basic Authentication  
**Format**: `Authorization: Basic {apiKey}`  
**API Key**: Stored in environment variable `DATAFORSEO_API_KEY`

**Setup:**
1. Get API key from [DataForSEO Dashboard](https://dataforseo.com/)
2. Set environment variable in Convex dashboard:
   ```
   DATAFORSEO_API_KEY=your_base64_encoded_credentials
   ```
3. API key is Base64-encoded `login:password` string

### Endpoints Used

#### 1. On-Page Task POST

**Endpoint**: `POST https://api.dataforseo.com/v3/on_page/task_post`  
**Purpose**: Submit a new on-page SEO audit task  
**Usage**: Called when user clicks "Skanuj stronę" in Business Settings

**Request:**
```json
[
  {
    "target": "https://dublinpainters.ie",
    "max_crawl_pages": 1,
    "load_resources": false,
    "enable_javascript": false,
    "calculate_keyword_density": true
  }
]
```

**Request Parameters:**
- `target` (string, required): URL to audit
- `max_crawl_pages` (number): Maximum pages to crawl (default: 1 for homepage only)
- `load_resources` (boolean): Load CSS/JS resources (default: false for speed)
- `enable_javascript` (boolean): Execute JavaScript (default: false)
- `calculate_keyword_density` (boolean): Calculate keyword density (default: true)

**Response:**
```json
{
  "version": "0.1.20240101",
  "status_code": 20000,
  "status_message": "Ok.",
  "time": "0.1234",
  "cost": 0.001,
  "tasks_count": 1,
  "tasks_error": 0,
  "tasks": [
    {
      "id": "1234567890",
      "status_code": 20000,
      "status_message": "Ok.",
      "time": "0.1234",
      "cost": 0.001
    }
  ]
}
```

**Response Fields:**
- `status_code`: 20000 = success, other codes = error
- `tasks[0].id`: Task ID used for polling results

**Error Handling:**
- If `status_code !== 20000`, throws `Error("DataForSEO API Error: {status_message}")`

---

#### 2. On-Page Summary (Polling)

**Endpoint**: `GET https://api.dataforseo.com/v3/on_page/summary/{taskId}`  
**Purpose**: Check status and get summary of on-page audit  
**Usage**: Polled every 3 seconds until `crawl_progress === "finished"`

**Request:**
- URL parameter: `taskId` from task POST response
- Headers: `Authorization: Basic {apiKey}`

**Response (In Progress):**
```json
{
  "version": "0.1.20240101",
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "crawl_progress": "in_progress",
          "crawl_status": "crawling"
        }
      ]
    }
  ]
}
```

**Response (Completed):**
```json
{
  "version": "0.1.20240101",
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "crawl_progress": "finished",
          "crawl_status": "completed",
          "page_metrics": {
            "onpage_score": 78,
            "links_external": 15,
            "links_internal": 42,
            "duplicate_title": 0,
            "duplicate_description": 0,
            "broken_links": 2
          },
          "checks": {
            "duplicate_title": 0,
            "duplicate_description": 0,
            "broken_links": 2,
            "is_https": true
          }
        }
      ]
    }
  ]
}
```

**Polling Logic:**
```typescript
let attempts = 0;
while (attempts < 30) { // Max 90 seconds
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s
  
  const response = await fetch(`.../summary/${taskId}`, {...});
  const data = await response.json();
  
  if (data.tasks[0].result[0].crawl_progress === "finished") {
    resultData = data.tasks[0].result[0];
    break;
  }
  attempts++;
}
```

**Timeout:**
- Maximum 30 attempts = 90 seconds
- If timeout, throws `Error("Audit timed out or failed")`

---

#### 3. On-Page Pages (Details)

**Endpoint**: `POST https://api.dataforseo.com/v3/on_page/pages`  
**Purpose**: Get detailed page information including meta tags and performance metrics  
**Usage**: Called after audit completes to get full page details

**Request:**
```json
[
  {
    "id": "1234567890",
    "limit": 1
  }
]
```

**Request Parameters:**
- `id` (string, required): Task ID from task POST
- `limit` (number): Number of pages to return (default: 1 for homepage)

**Response:**
```json
{
  "version": "0.1.20240101",
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "items": [
            {
              "meta": {
                "title": "Dublin Painters - Professional Painting Services",
                "description": "Professional painting services in Dublin...",
                "canonical": "https://dublinpainters.ie",
                "h1": ["Professional Painting Services in Dublin"],
                "server": "nginx/1.18.0",
                "cumulative_layout_shift": 0.15
              },
              "page_timing": {
                "dom_content_loaded_time": 2400,
                "waiting_time": 120
              }
            }
          ]
        }
      ]
    }
  ]
}
```

**Response Fields Used:**
- `meta.title`: Page title
- `meta.description`: Meta description
- `meta.canonical`: Canonical URL
- `meta.h1`: Array of H1 tags
- `meta.server`: Web server type
- `meta.cumulative_layout_shift`: CLS metric
- `page_timing.dom_content_loaded_time`: LCP approximation
- `page_timing.waiting_time`: FID approximation

---

#### 4. Keywords For Site

**Endpoint**: `POST https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/live`  
**Purpose**: Generate keyword suggestions based on website content  
**Usage**: Automatically called after successful on-page audit

**Request:**
```json
[
  {
    "target": "https://dublinpainters.ie",
    "location_code": 2372,
    "language_code": "en",
    "include_adult_keywords": false,
    "limit": 10,
    "sort_by": "search_volume"
  }
]
```

**Request Parameters:**
- `target` (string, required): Website URL
- `location_code` (number, required): Geographic location code
  - `2372`: Ireland
  - `2616`: Poland
- `language_code` (string, required): Language code (`"en"` or `"pl"`)
- `include_adult_keywords` (boolean): Include adult content keywords (default: false)
- `limit` (number): Maximum keywords to return (default: 10)
- `sort_by` (string): Sort order (`"search_volume"` for highest volume first)

**Location Detection:**
```typescript
const isPl = args.url.includes(".pl");
const locationCode = isPl ? 2616 : 2372; // Poland vs Ireland
const languageCode = isPl ? "pl" : "en";
```

**Response:**
```json
{
  "version": "0.1.20240101",
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "keyword": "painter dublin",
          "search_volume": 1200,
          "cpc": 2.50,
          "competition_index": 45
        },
        {
          "keyword": "house painting dublin",
          "search_volume": 850,
          "cpc": 1.80,
          "competition_index": 30
        }
        // ... more keywords
      ]
    }
  ]
}
```

**Response Fields:**
- `keyword`: Search phrase
- `search_volume`: Monthly search volume
- `cpc`: Cost per click (estimated)
- `competition_index`: Competition level (0-100)

**Data Transformation:**
```typescript
keywords = keywordsData.tasks[0].result.map((item) => ({
  keyword: item.keyword,
  volume: item.search_volume || 0,
  cpc: item.cpc || 0,
  difficulty: item.competition_index || 0
}));
```

**Error Handling:**
- If API fails, keywords array remains empty (non-blocking)
- Error logged to console but doesn't fail entire audit

---

### Complete Workflow

```
1. User clicks "Skanuj stronę"
   ↓
2. Frontend: SeoService.runAudit(url)
   ↓
3. Convex Action: seo.runAuditAction({ url, orgId })
   ↓
4. POST Task: v3/on_page/task_post
   ├─ Returns: taskId
   ↓
5. Poll Results: v3/on_page/summary/{taskId}
   ├─ Every 3 seconds
   ├─ Max 30 attempts (90 seconds)
   └─ Wait for crawl_progress === "finished"
   ↓
6. Fetch Details: v3/on_page/pages
   ├─ Get meta tags, performance metrics
   ↓
7. Fetch Keywords: v3/keywords_data/google_ads/keywords_for_site/live
   ├─ Get keyword suggestions
   ↓
8. Transform Data
   ├─ Map to internal format
   ├─ Calculate scores
   └─ Extract issues
   ↓
9. Save to DB: seo.saveAuditResult mutation
   ├─ Store full result
   ├─ Store score, metaTitle (denormalized)
   ↓
10. Return Result to Frontend
    ├─ Display in UI
    └─ Show keyword suggestions
```

### Error Handling

**API Errors:**
- `status_code !== 20000`: Throws `Error("DataForSEO API Error: {message}")`
- Missing API key: Throws `Error("Missing DATAFORSEO_API_KEY")`
- Timeout: Throws `Error("Audit timed out or failed")`

**Retry Logic:**
- No automatic retries (user can retry manually)
- Polling handles temporary failures (retries every 3s)

**Rate Limiting:**
- DataForSEO has rate limits based on plan
- Current implementation doesn't handle rate limits (future enhancement)

### Cost Considerations

**API Costs:**
- On-Page Task: ~$0.001 per task
- Keywords For Site: ~$0.001 per request
- Total per audit: ~$0.002

**Optimization:**
- Cache results for 24 hours (avoid duplicate audits)
- Limit to homepage only (`max_crawl_pages: 1`)
- Disable resource loading for speed

---

## Google Maps Platform Integration

Google Maps Platform provides place data and map visualization. We use two APIs:

### 1. Places API

**Purpose**: Place autocomplete and place details  
**Usage**: "Google Place ID" search in Business Settings

**Current Status**: **Not Yet Implemented** (mock geocoding used)

**Planned Implementation:**
- **Autocomplete**: `https://maps.googleapis.com/maps/api/place/autocomplete/json`
- **Place Details**: `https://maps.googleapis.com/maps/api/place/details/json`

**API Key Setup:**
1. Create API key in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Set environment variable: `VITE_GOOGLE_MAPS_API_KEY`

**Planned Features:**
- Autocomplete search for business name
- Get Place ID from search
- Get business details (address, phone, hours, etc.)

**Example Request (Planned):**
```javascript
// Autocomplete
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}`
);

// Place Details
const details = await fetch(
  `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
);
```

---

### 2. Maps JavaScript API

**Purpose**: Map visualization  
**Usage**: Grid visualization in Location Settings (future)

**Current Status**: **Not Used** (Leaflet used instead)

**Alternative**: Currently using **Leaflet** for map rendering:
- `leaflet`: 1.9.4
- `leaflet.markercluster`: 1.5.3

**Why Leaflet:**
- Open source (no API key required)
- Lightweight
- Good clustering support
- Sufficient for grid visualization

**Future Consideration:**
- May switch to Google Maps for better integration with Places API
- Would require API key and billing setup

---

## API Key Management

### Environment Variables

**Convex (Backend):**
- `DATAFORSEO_API_KEY`: DataForSEO credentials (Base64 encoded)

**Frontend (Future):**
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key

### Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables** for all keys
3. **Restrict API key permissions** in provider dashboards
4. **Monitor usage** for unexpected spikes
5. **Rotate keys** periodically

### Cost Monitoring

**DataForSEO:**
- Monitor usage in DataForSEO dashboard
- Set up alerts for high usage
- Cache results to reduce API calls

**Google Maps (Future):**
- Set up billing alerts
- Monitor quota usage
- Implement request throttling if needed
