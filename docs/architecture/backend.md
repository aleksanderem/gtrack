# Backend Architecture (Convex)

GTRACK uses [Convex](https://convex.dev) as its backend infrastructure. Convex provides a real-time database, serverless functions, and file storage in a single platform.

## Database Schema

The database is designed around a multi-tenant architecture where the **Organization** is the central entity. All data is scoped to organizations, ensuring proper isolation between tenants.

### 1. Organizations (`organizations`)
The root entity representing a tenant (business). This is the top-level container for all business data.

**Schema Definition:**
```typescript
organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    website: v.optional(v.string()),
    plan: v.union(v.literal("basic"), v.literal("professional"), v.literal("enterprise")),
    subscriptionStatus: v.string(),
    stripeCustomerId: v.optional(v.string()),
    settings: v.object({
        timezone: v.string(),
        language: v.string(),
    }),
    businessProfile: v.optional(v.object({
        placeId: v.optional(v.string()),
        cid: v.optional(v.string()),
        isConnected: v.optional(v.boolean()),
    })),
    gridSettings: v.optional(v.object({
        maxSize: v.number(),
        stepKm: v.number(),
        centerName: v.string(),
        centerLat: v.optional(v.number()),
        centerLng: v.optional(v.number()),
    })),
    featureFlags: v.optional(v.object({
        autoReply: v.boolean(),
        photoMonitoring: v.boolean(),
        postPublishing: v.boolean(),
        dataProtection: v.boolean(),
        qaMonitoring: v.boolean(),
        hoursSync: v.boolean(),
    })),
}).index("by_slug", ["slug"])
```

**Fields:**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Display name of the business. | `"Dublin Painters Ltd"` |
| `slug` | `string` | Unique identifier for URLs (indexed). Used in routing. | `"dublin-painters"` |
| `website` | `string?` | Business website URL. Used for SEO audits. | `"https://dublinpainters.ie"` |
| `plan` | `union` | Subscription tier: `'basic'`, `'professional'`, `'enterprise'`. Determines feature access and limits. | `"professional"` |
| `subscriptionStatus` | `string` | Current subscription status: `'active'`, `'trial'`, `'past_due'`. | `"active"` |
| `stripeCustomerId` | `string?` | Stripe customer ID for billing integration. | `"cus_abc123"` |
| `settings` | `object` | Global preferences: | |
| `settings.timezone` | `string` | Organization timezone (IANA format). | `"Europe/Dublin"` |
| `settings.language` | `string` | Default language code. | `"en"` |
| `businessProfile` | `object?` | Google Maps integration data: | |
| `businessProfile.placeId` | `string?` | Google Place ID (ChIJ... format). | `"ChIJN1t_tDeuEmsRUsoyG83frY4"` |
| `businessProfile.cid` | `string?` | Google Customer ID (legacy). | `"1234567890123456789"` |
| `businessProfile.isConnected` | `boolean?` | Whether Google Business Profile is connected. | `true` |
| `gridSettings` | `object?` | Map scanning configuration: | |
| `gridSettings.maxSize` | `number` | Maximum grid size (3-15). | `9` |
| `gridSettings.stepKm` | `number` | Distance between grid points in kilometers. | `1` |
| `gridSettings.centerName` | `string` | Human-readable center location name. | `"123 O'Connell Street, Dublin"` |
| `gridSettings.centerLat` | `number?` | Center latitude. | `53.3498` |
| `gridSettings.centerLng` | `number?` | Center longitude. | `-6.2603` |
| `featureFlags` | `object?` | Feature toggles (enabled/disabled): | |
| `featureFlags.autoReply` | `boolean` | Auto-reply to reviews enabled. | `false` |
| `featureFlags.photoMonitoring` | `boolean` | Photo monitoring enabled. | `true` |
| `featureFlags.postPublishing` | `boolean` | Post publishing enabled. | `false` |
| `featureFlags.dataProtection` | `boolean` | Data protection enabled. | `true` |
| `featureFlags.qaMonitoring` | `boolean` | Q&A monitoring enabled. | `false` |
| `featureFlags.hoursSync` | `boolean` | Hours synchronization enabled. | `false` |

**Indexes:**
- `by_slug`: Unique index on `slug` for fast lookups by URL identifier.

**Example Document:**
```json
{
  "_id": "k123abc",
  "_creationTime": 1704067200000,
  "name": "Dublin Painters Ltd",
  "slug": "dublin-painters",
  "website": "https://dublinpainters.ie",
  "plan": "professional",
  "subscriptionStatus": "active",
  "settings": {
    "timezone": "Europe/Dublin",
    "language": "en"
  },
  "businessProfile": {
    "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
    "isConnected": true
  },
  "gridSettings": {
    "maxSize": 9,
    "stepKm": 1,
    "centerName": "123 O'Connell Street, Dublin",
    "centerLat": 53.3498,
    "centerLng": -6.2603
  },
  "featureFlags": {
    "autoReply": false,
    "photoMonitoring": true,
    "postPublishing": false,
    "dataProtection": true,
    "qaMonitoring": false,
    "hoursSync": false
  }
}
```

### 2. Users (`users`)
Users are associated with organizations. Each user belongs to exactly one organization and has a role.

**Schema Definition:**
```typescript
users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
}).index("by_token", ["tokenIdentifier"])
  .index("by_org", ["orgId"])
```

**Fields:**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `tokenIdentifier` | `string` | External Auth ID (e.g., from Clerk/Auth0). Used for authentication. | `"user_abc123"` |
| `name` | `string` | User's display name. | `"John Doe"` |
| `email` | `string` | User's email address. | `"john@example.com"` |
| `orgId` | `id` | Reference to the `organizations` table. | `"k123abc"` |
| `role` | `union` | User role: `'admin'` (full access) or `'member'` (limited access). | `"admin"` |

**Indexes:**
- `by_token`: Index on `tokenIdentifier` for fast user lookups during authentication.
- `by_org`: Index on `orgId` for querying all users in an organization.

**Example Document:**
```json
{
  "_id": "j456def",
  "_creationTime": 1704067200000,
  "tokenIdentifier": "user_abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "orgId": "k123abc",
  "role": "admin"
}
```

### 3. Keywords (`keywords`)
List of search phrases monitored for ranking. Each keyword belongs to an organization.

**Schema Definition:**
```typescript
keywords: defineTable({
    orgId: v.id("organizations"),
    keyword: v.string(),
    createdAt: v.number(),
}).index("by_org", ["orgId"])
  .index("by_org_keyword", ["orgId", "keyword"])
```

**Fields:**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `orgId` | `id` | Owner organization. | `"k123abc"` |
| `keyword` | `string` | The search phrase to monitor. | `"restaurant dublin"` |
| `createdAt` | `number` | Timestamp when keyword was added (milliseconds since epoch). | `1704067200000` |

**Indexes:**
- `by_org`: Index on `orgId` for querying all keywords for an organization.
- `by_org_keyword`: Compound unique index on `[orgId, keyword]` to prevent duplicates and enable fast existence checks.

**Example Document:**
```json
{
  "_id": "m789ghi",
  "_creationTime": 1704067200000,
  "orgId": "k123abc",
  "keyword": "restaurant dublin",
  "createdAt": 1704067200000
}
```

### 4. SEO Audits (`seoAudits`)
Stores the history and results of on-page SEO scans. Each audit is tied to a URL and organization.

**Schema Definition:**
```typescript
seoAudits: defineTable({
    orgId: v.id("organizations"),
    url: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    dataForSeoTaskId: v.optional(v.string()),
    score: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    fullResult: v.optional(v.any()),
    createdAt: v.number(),
}).index("by_org_url", ["orgId", "url"])
  .index("by_org_date", ["orgId", "createdAt"])
```

**Fields:**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `orgId` | `id` | Owner organization. | `"k123abc"` |
| `url` | `string` | The audited URL. | `"https://dublinpainters.ie"` |
| `status` | `union` | Audit status: `'pending'` (in progress), `'completed'` (success), `'failed'` (error). | `"completed"` |
| `dataForSeoTaskId` | `string?` | Task ID from DataForSEO API. Used for polling results. | `"1234567890"` |
| `score` | `number?` | Calculated SEO score (0-100). Denormalized for quick display. | `78` |
| `metaTitle` | `string?` | Page title from audit. Denormalized for quick display. | `"Dublin Painters - Professional Painting Services"` |
| `fullResult` | `any?` | Complete raw response from DataForSEO API. Contains all audit details. | `{ on_page: {...}, keywords: [...] }` |
| `createdAt` | `number` | Timestamp when audit was created/updated. | `1704067200000` |

**Indexes:**
- `by_org_url`: Compound index on `[orgId, url]` for finding the latest audit for a specific URL.
- `by_org_date`: Compound index on `[orgId, createdAt]` for querying audit history sorted by date.

**Example Document:**
```json
{
  "_id": "a012jkl",
  "_creationTime": 1704067200000,
  "orgId": "k123abc",
  "url": "https://dublinpainters.ie",
  "status": "completed",
  "dataForSeoTaskId": "1234567890",
  "score": 78,
  "metaTitle": "Dublin Painters - Professional Painting Services",
  "createdAt": 1704067200000,
  "fullResult": {
    "audit_time": "2024-01-01T12:00:00Z",
    "on_page": {
      "meta": { "title": {...}, "description": {...} },
      "performance": { "score": 78 },
      "issues": [...]
    },
    "keywords": [
      { "keyword": "painter dublin", "volume": 1200, "cpc": 2.50 }
    ]
  }
}
```

### 5. Feature Usage (`featureUsage`)
Tracks consumption of limited resources per billing period. Used for enforcing plan limits.

**Schema Definition:**
```typescript
featureUsage: defineTable({
    orgId: v.id("organizations"),
    featureKey: v.string(),
    periodStart: v.number(),
    count: v.number(),
    limitSnapshot: v.number(),
}).index("by_org_period", ["orgId", "periodStart"])
```

**Fields:**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `orgId` | `id` | Owner organization. | `"k123abc"` |
| `featureKey` | `string` | Identifier for the feature being tracked (e.g., `'seo_audits'`, `'keywords_tracked'`). | `"seo_audits"` |
| `periodStart` | `number` | Timestamp of the current billing period start (typically first day of month). | `1704067200000` |
| `count` | `number` | Current usage count for this period. | `3` |
| `limitSnapshot` | `number` | Limit value at the time of record creation (for historical tracking). | `20` |

**Indexes:**
- `by_org_period`: Compound index on `[orgId, periodStart]` for querying usage for a specific period.

**Example Document:**
```json
{
  "_id": "u345mno",
  "_creationTime": 1704067200000,
  "orgId": "k123abc",
  "featureKey": "seo_audits",
  "periodStart": 1704067200000,
  "count": 3,
  "limitSnapshot": 20
}
```

## Functions Structure

Backend logic is organized into modular files within the `convex/` directory:

- **`schema.ts`**: Database schema definitions using Convex validators.
- **`organizations.ts`**: Organization management, settings updates, business profile management.
- **`keywords.ts`**: Keyword CRUD operations with limit enforcement.
- **`seo.ts`**: Integration with DataForSEO (Actions) and audit storage (Mutations).
- **`featureLimits.ts`**: Helper functions for enforcing plan limits.

## Convex Functions Reference

### Organizations API (`convex/organizations.ts`)

#### `getCurrent` (Query)
Returns the current organization context. In development, returns the first organization found. In production, should use `ctx.auth` to determine the user's organization.

**Signature:**
```typescript
export const getCurrent = query({
    args: {},
    handler: async (ctx) => Promise<Organization | null>
});
```

**Parameters:** None

**Returns:** `Organization | null` - The organization document or null if not found.

**Use Cases:**
- Fetching organization settings in Settings view
- Getting current plan for feature checking
- Accessing business profile data

**Example Usage:**
```typescript
const org = await convex.query(api.organizations.getCurrent);
if (org) {
  console.log(org.plan); // "professional"
  console.log(org.businessProfile?.placeId);
}
```

**Real-time Subscription:**
```typescript
convex.onUpdate(api.organizations.getCurrent, {}, (org) => {
  // Automatically called when organization data changes
  orgData.value = org;
});
```

#### `createDevOrg` (Mutation)
Creates an initial organization for development setup. Checks if organization with given slug already exists.

**Signature:**
```typescript
export const createDevOrg = mutation({
    args: { 
        name: v.string(), 
        slug: v.string() 
    },
    handler: async (ctx, args) => Promise<Id<"organizations">>
});
```

**Parameters:**
- `name` (string): Display name of the business
- `slug` (string): Unique URL identifier

**Returns:** `Id<"organizations">` - The ID of the created or existing organization.

**Behavior:**
- If organization with slug exists, returns existing ID (idempotent)
- Creates new organization with default settings:
  - `plan`: `"professional"` (default for dev)
  - `subscriptionStatus`: `"active"`
  - `settings.timezone`: `"Europe/Dublin"`
  - `settings.language`: `"en"`

**Example Usage:**
```typescript
const orgId = await convex.mutation(api.organizations.createDevOrg, {
  name: "Dublin Painters",
  slug: "dublin-painters"
});
```

#### `updateWebsiteUrl` (Mutation)
Updates the website URL for an organization.

**Signature:**
```typescript
export const updateWebsiteUrl = mutation({
    args: { 
        orgId: v.id("organizations"), 
        url: v.string() 
    },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `orgId` (Id<"organizations">): Organization ID
- `url` (string): Website URL to set

**Returns:** `void`

**Example Usage:**
```typescript
await convex.mutation(api.organizations.updateWebsiteUrl, {
  orgId: org._id,
  url: "https://dublinpainters.ie"
});
```

#### `updateSettings` (Mutation)
Updates organization configuration. Supports partial updates - only provided fields are updated.

**Signature:**
```typescript
export const updateSettings = mutation({
    args: {
        orgId: v.id("organizations"),
        businessProfile: v.optional(v.object({
            placeId: v.optional(v.string()),
            cid: v.optional(v.string()),
            isConnected: v.optional(v.boolean()),
        })),
        gridSettings: v.optional(v.object({
            maxSize: v.number(),
            stepKm: v.number(),
            centerName: v.string(),
            centerLat: v.optional(v.number()),
            centerLng: v.optional(v.number()),
        })),
        featureFlags: v.optional(v.object({
            autoReply: v.boolean(),
            photoMonitoring: v.boolean(),
            postPublishing: v.boolean(),
            dataProtection: v.boolean(),
            qaMonitoring: v.boolean(),
            hoursSync: v.boolean(),
        })),
    },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `orgId` (Id<"organizations">): Organization ID
- `businessProfile` (object?, optional): Google Business Profile data
- `gridSettings` (object?, optional): Map grid configuration
- `featureFlags` (object?, optional): Feature toggle settings

**Returns:** `void`

**Behavior:**
- Only updates fields that are provided (partial update)
- Replaces entire nested objects (e.g., `businessProfile` is replaced, not merged)
- Triggers reactive updates to all subscribers of `getCurrent`

**Example Usage:**
```typescript
// Update only business profile
await convex.mutation(api.organizations.updateSettings, {
  orgId: org._id,
  businessProfile: {
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    isConnected: true
  }
});

// Update multiple sections at once
await convex.mutation(api.organizations.updateSettings, {
  orgId: org._id,
  gridSettings: {
    maxSize: 9,
    stepKm: 1,
    centerName: "Dublin City Center"
  },
  featureFlags: {
    autoReply: true,
    photoMonitoring: true
  }
});
```

### Keywords API (`convex/keywords.ts`)

#### `getKeywords` (Query)
Returns all keywords for the current organization.

**Signature:**
```typescript
export const getKeywords = query({
    args: {},
    handler: async (ctx) => Promise<Keyword[]>
});
```

**Parameters:** None (uses `getCurrentOrgId` helper internally)

**Returns:** `Keyword[]` - Array of keyword documents

**Use Cases:**
- Displaying keyword list in Settings
- Checking current keyword count for limit validation
- Real-time updates when keywords are added/removed

**Example Usage:**
```typescript
const keywords = await convex.query(api.keywords.getKeywords);
// [{ _id: "...", keyword: "restaurant dublin", ... }, ...]
```

**Real-time Subscription:**
```typescript
convex.onUpdate(api.keywords.getKeywords, {}, (keywords) => {
  localKeywords.value = keywords;
});
```

#### `addKeyword` (Mutation)
Adds a new keyword. Enforces plan limits and prevents duplicates.

**Signature:**
```typescript
export const addKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `keyword` (string): The search phrase to add

**Returns:** `void`

**Behavior:**
1. Gets current organization ID via `getCurrentOrgId()`
2. Checks if keyword already exists (using `by_org_keyword` index)
3. Counts current keywords for limit checking
4. Calls `checkLimit()` to validate against plan limits
5. Inserts new keyword document with `createdAt` timestamp
6. If limit exceeded, throws `Error` with message

**Error Cases:**
- Keyword already exists: Silently returns (idempotent)
- Limit exceeded: Throws `Error("Plan limit reached for maxKeywords. Limit: X, Current: Y")`

**Example Usage:**
```typescript
try {
  await convex.mutation(api.keywords.addKeyword, {
    keyword: "restaurant dublin"
  });
  // Success - keyword added
} catch (error) {
  // Limit exceeded or other error
  console.error(error.message);
}
```

#### `removeKeyword` (Mutation)
Removes a keyword by exact match.

**Signature:**
```typescript
export const removeKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `keyword` (string): The exact keyword to remove

**Returns:** `void`

**Behavior:**
1. Gets current organization ID
2. Finds keyword using `by_org_keyword` index
3. Deletes document if found
4. If not found, silently returns (idempotent)

**Example Usage:**
```typescript
await convex.mutation(api.keywords.removeKeyword, {
  keyword: "restaurant dublin"
});
```

### SEO API (`convex/seo.ts`)

#### `runAuditAction` (Action)
Triggers a DataForSEO audit and fetches keyword suggestions. This is a long-running async operation.

**Signature:**
```typescript
export const runAuditAction = action({
    args: { 
        url: v.string(), 
        orgId: v.id("organizations") 
    },
    handler: async (ctx, args) => Promise<AuditResult>
});
```

**Parameters:**
- `url` (string): Target URL to audit
- `orgId` (Id<"organizations">): Organization ID

**Returns:** `AuditResult` - Complete audit result with on-page data and keywords

**Workflow:**
1. **POST Task**: Sends request to DataForSEO `v3/on_page/task_post` API
2. **Polling**: Polls `v3/on_page/summary/{taskId}` every 3 seconds (max 30 attempts = 90 seconds)
3. **Fetch Details**: Once complete, fetches detailed page data from `v3/on_page/pages`
4. **Fetch Keywords**: Calls `v3/keywords_data/google_ads/keywords_for_site/live` for keyword suggestions
5. **Save Result**: Calls `saveAuditResult` mutation to store results in database
6. **Return**: Returns formatted result object

**Error Handling:**
- Missing API key: Throws `Error("Missing DATAFORSEO_API_KEY")`
- API errors: Throws `Error("DataForSEO API Error: {message}")`
- Timeout: Throws `Error("Audit timed out or failed")`

**Example Usage:**
```typescript
const result = await convex.action(api.seo.runAuditAction, {
  url: "https://dublinpainters.ie",
  orgId: org._id
});

console.log(result.on_page.performance.score); // 78
console.log(result.keywords); // [{ keyword: "...", volume: 1200, ... }]
```

**Result Structure:**
```typescript
{
  audit_time: string, // ISO timestamp
  on_page: {
    meta: {
      title: { value: string, length: number, status: string },
      description: { value: string, length: number, status: string },
      canonical: string,
      h1: string[]
    },
    performance: {
      lcp: number, // Largest Contentful Paint (seconds)
      cls: number, // Cumulative Layout Shift
      fid: number, // First Input Delay (milliseconds)
      score: number // Overall score (0-100)
    },
    issues: Array<{
      type: "error" | "warning" | "info",
      message: string,
      severity: "high" | "medium" | "low"
    }>,
    technologies: string[]
  },
  keywords: Array<{
    keyword: string,
    volume: number,
    cpc: number,
    difficulty: number
  }>
}
```

#### `saveAuditResult` (Mutation)
Saves audit result to database. Updates existing audit if found, otherwise creates new.

**Signature:**
```typescript
export const saveAuditResult = mutation({
    args: {
        orgId: v.id("organizations"),
        url: v.string(),
        fullResult: v.any(),
        score: v.number(),
        metaTitle: v.string()
    },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `orgId` (Id<"organizations">): Organization ID
- `url` (string): Audited URL
- `fullResult` (any): Complete audit result object
- `score` (number): SEO score (0-100)
- `metaTitle` (string): Page title

**Returns:** `void`

**Behavior:**
- Checks for existing audit using `by_org_url` index
- If exists: Updates with `patch()` (status → "completed", new data)
- If not exists: Creates new document with `insert()`
- Always updates `createdAt` to current timestamp

**Example Usage:**
```typescript
// Called internally by runAuditAction
await ctx.runMutation(api.seo.saveAuditResult, {
  orgId: args.orgId,
  url: args.url,
  fullResult: result,
  score: result.on_page.performance.score,
  metaTitle: result.on_page.meta.title.value
});
```

#### `getAudit` (Query)
Retrieves the latest audit for a specific URL.

**Signature:**
```typescript
export const getAudit = query({
    args: { 
        url: v.string(), 
        orgId: v.id("organizations") 
    },
    handler: async (ctx, args) => Promise<SeoAudit | null>
});
```

**Parameters:**
- `url` (string): URL to get audit for
- `orgId` (Id<"organizations">): Organization ID

**Returns:** `SeoAudit | null` - Audit document or null if not found

**Use Cases:**
- Displaying audit results in UI
- Checking if audit exists before running new one
- Cache checking (if audit is recent, skip new audit)

**Example Usage:**
```typescript
const audit = await convex.query(api.seo.getAudit, {
  url: "https://dublinpainters.ie",
  orgId: org._id
});

if (audit && audit.status === "completed") {
  console.log(`Score: ${audit.score}`);
  console.log(`Title: ${audit.metaTitle}`);
}
```

### Feature Limits API (`convex/featureLimits.ts`)

#### `getPlanLimits` (Helper Function)
Gets the limit configuration for an organization's plan.

**Signature:**
```typescript
export async function getPlanLimits(
    ctx: QueryCtx,
    orgId: Id<"organizations">
): Promise<PlanLimits>
```

**Parameters:**
- `ctx` (QueryCtx): Convex query context
- `orgId` (Id<"organizations">): Organization ID

**Returns:** `PlanLimits` - Object with limit values for current plan

**Plan Limits:**
```typescript
{
  basic: {
    maxKeywords: 10,
    maxAudits: 5
  },
  professional: {
    maxKeywords: 50,
    maxAudits: 20
  },
  enterprise: {
    maxKeywords: 1000,
    maxAudits: 100
  }
}
```

**Behavior:**
- Fetches organization document
- Extracts `plan` field
- Defaults to `"basic"` if plan is missing or invalid
- Returns corresponding limits object

**Example Usage:**
```typescript
const limits = await getPlanLimits(ctx, orgId);
console.log(limits.maxKeywords); // 50 (if professional plan)
```

#### `checkLimit` (Helper Function)
Validates that current usage is below the plan limit. Throws error if limit exceeded.

**Signature:**
```typescript
export async function checkLimit(
    ctx: QueryCtx,
    orgId: Id<"organizations">,
    featureKey: keyof typeof PLAN_LIMITS.basic,
    currentUsage: number
): Promise<true>
```

**Parameters:**
- `ctx` (QueryCtx): Convex query context
- `orgId` (Id<"organizations">): Organization ID
- `featureKey` (string): Limit key to check (`"maxKeywords"` or `"maxAudits"`)
- `currentUsage` (number): Current usage count

**Returns:** `true` if within limit

**Error Cases:**
- Limit exceeded: Throws `Error("Plan limit reached for {featureKey}. Limit: X, Current: Y")`

**Example Usage:**
```typescript
const currentCount = (await ctx.db
  .query("keywords")
  .withIndex("by_org", (q) => q.eq("orgId", orgId))
  .collect()).length;

await checkLimit(ctx, orgId, "maxKeywords", currentCount);
// Throws if limit exceeded, otherwise returns true
```

## Indexes and Query Performance

### Index Strategy

**Single Field Indexes:**
- `organizations.by_slug`: Fast lookups by URL slug
- `users.by_token`: Fast user authentication lookups
- `users.by_org`: Fast queries for all users in an organization

**Compound Indexes:**
- `keywords.by_org_keyword`: Unique constraint + fast existence checks
- `seoAudits.by_org_url`: Fast lookups of latest audit for a URL
- `seoAudits.by_org_date`: Fast sorted queries of audit history
- `featureUsage.by_org_period`: Fast queries of usage for a billing period

**Query Patterns:**
- Most queries filter by `orgId` first (multi-tenant isolation)
- Compound indexes support efficient range queries and sorting
- Unique indexes prevent duplicates and enable fast existence checks

## Security & Access Control

### Current Implementation (Development)
- **Simplified Model**: Single organization hardcoded via `getCurrentOrgId()` helper
- **No Authentication**: All functions assume single-tenant development mode
- **Organization Context**: Retrieved via `getCurrent()` query (first org found)

### Production Model (Planned)
- **Authentication**: Use `ctx.auth` to get authenticated user
- **Authorization**: Validate user belongs to organization before data access
- **Role-Based Access**: Check `user.role` for admin vs member permissions
- **Multi-Tenant Isolation**: Every query/mutation validates `orgId` matches user's organization

**Example Production Pattern:**
```typescript
export const getKeywords = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Get user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    
    if (!user) throw new Error("User not found");
    
    // Query keywords for user's organization
    return await ctx.db
      .query("keywords")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .collect();
  }
});
```

## Error Handling Patterns

### Standard Error Types
1. **Validation Errors**: Invalid input data (handled by Convex validators)
2. **Not Found Errors**: Missing resources (organization, user, etc.)
3. **Limit Exceeded Errors**: Plan limits reached
4. **External API Errors**: DataForSEO API failures
5. **Timeout Errors**: Long-running operations that exceed time limits

### Error Propagation
- Mutations throw errors that propagate to frontend
- Frontend catches and displays user-friendly messages
- Actions wrap external API calls with try/catch
- Database operations use Convex's built-in error handling

## Background Jobs & Scheduling

### Current Implementation
- **Actions**: Long-running tasks (SEO audits) run as Actions
- **Polling**: Actions poll external APIs until completion
- **No Scheduling**: No cron jobs or scheduled tasks yet

### Future Considerations
- **Scheduled Actions**: Use Convex cron jobs for periodic tasks
- **Keyword Scanning**: Scheduled keyword position checks
- **Report Generation**: Scheduled email reports
- **Usage Reset**: Monthly usage counter resets
