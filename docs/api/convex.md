# Convex API Reference

Complete reference for all Convex backend functions (Queries, Mutations, Actions).

## Organizations API

### `organizations.getCurrent`

**Type**: Query  
**File**: `convex/organizations.ts`  
**Purpose**: Returns the current organization context for the authenticated user.

**Signature:**
```typescript
export const getCurrent = query({
    args: {},
    handler: async (ctx) => Promise<Organization | null>
});
```

**Parameters:**
- None (uses internal `getCurrentOrgId()` helper)

**Returns:**
- `Organization | null`: The organization document or null if not found

**Current Implementation:**
- Development mode: Returns first organization found (single-tenant)
- Production mode: Should use `ctx.auth` to get user's organization

**Use Cases:**
- Loading organization settings in Settings view
- Getting current plan for feature checking
- Accessing business profile data
- Reading grid configuration

**Example Usage:**
```javascript
// One-time query
const org = await convex.query(api.organizations.getCurrent);
console.log(org.plan); // "professional"
console.log(org.businessProfile?.placeId);

// Real-time subscription
convex.onUpdate(api.organizations.getCurrent, {}, (org) => {
  orgData.value = org;
});
```

**Returned Object Structure:**
See [Backend Architecture - Organizations Schema](../architecture/backend.md#1-organizations-organizations) for complete structure.

---

### `organizations.createDevOrg`

**Type**: Mutation  
**File**: `convex/organizations.ts`  
**Purpose**: Creates an initial organization for development setup.

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
- `name` (string, required): Display name of the business
- `slug` (string, required): Unique URL identifier (e.g., "dublin-painters")

**Returns:**
- `Id<"organizations">`: The ID of the created or existing organization

**Behavior:**
- **Idempotent**: If organization with slug exists, returns existing ID
- **Default Values**:
  - `plan`: `"professional"` (default for dev)
  - `subscriptionStatus`: `"active"`
  - `settings.timezone`: `"Europe/Dublin"`
  - `settings.language`: `"en"`

**Example Usage:**
```javascript
const orgId = await convex.mutation(api.organizations.createDevOrg, {
  name: "Dublin Painters",
  slug: "dublin-painters"
});
```

**Error Cases:**
- None (idempotent operation)

---

### `organizations.updateWebsiteUrl`

**Type**: Mutation  
**File**: `convex/organizations.ts`  
**Purpose**: Updates the website URL for an organization.

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
- `orgId` (Id<"organizations">, required): Organization ID
- `url` (string, required): Website URL to set

**Returns:**
- `void`

**Example Usage:**
```javascript
await convex.mutation(api.organizations.updateWebsiteUrl, {
  orgId: org._id,
  url: "https://dublinpainters.ie"
});
```

**Error Cases:**
- Organization not found: Convex throws error

---

### `organizations.updateSettings`

**Type**: Mutation  
**File**: `convex/organizations.ts`  
**Purpose**: Updates organization configuration. Supports partial updates.

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
- `orgId` (Id<"organizations">, required): Organization ID
- `businessProfile` (object?, optional): Google Business Profile data
  - `placeId` (string?, optional): Google Place ID
  - `cid` (string?, optional): Google Customer ID (legacy)
  - `isConnected` (boolean?, optional): Connection status
- `gridSettings` (object?, optional): Map grid configuration
  - `maxSize` (number, required): Maximum grid size (3-15)
  - `stepKm` (number, required): Distance between points (km)
  - `centerName` (string, required): Center location name
  - `centerLat` (number?, optional): Center latitude
  - `centerLng` (number?, optional): Center longitude
- `featureFlags` (object?, optional): Feature toggle settings
  - All fields are boolean

**Returns:**
- `void`

**Behavior:**
- **Partial Update**: Only provided fields are updated
- **Nested Objects**: Entire nested objects are replaced (not merged)
- **Reactive Updates**: All subscribers to `getCurrent` receive updates automatically

**Example Usage:**
```javascript
// Update only business profile
await convex.mutation(api.organizations.updateSettings, {
  orgId: org._id,
  businessProfile: {
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    isConnected: true
  }
});

// Update multiple sections
await convex.mutation(api.organizations.updateSettings, {
  orgId: org._id,
  gridSettings: {
    maxSize: 9,
    stepKm: 1,
    centerName: "Dublin City Center",
    centerLat: 53.3498,
    centerLng: -6.2603
  },
  featureFlags: {
    autoReply: true,
    photoMonitoring: true,
    dataProtection: true
  }
});
```

**Error Cases:**
- Organization not found: Convex throws error
- Invalid data types: Convex validators throw error

---

## Keywords API

### `keywords.getKeywords`

**Type**: Query  
**File**: `convex/keywords.ts`  
**Purpose**: Returns all keywords for the current organization.

**Signature:**
```typescript
export const getKeywords = query({
    args: {},
    handler: async (ctx) => Promise<Keyword[]>
});
```

**Parameters:**
- None (uses internal `getCurrentOrgId()` helper)

**Returns:**
- `Keyword[]`: Array of keyword documents

**Use Cases:**
- Displaying keyword list in Settings
- Checking current keyword count for limit validation
- Real-time updates when keywords are added/removed

**Example Usage:**
```javascript
// One-time query
const keywords = await convex.query(api.keywords.getKeywords);
console.log(keywords.length); // 5

// Real-time subscription
convex.onUpdate(api.keywords.getKeywords, {}, (keywords) => {
  localKeywords.value = keywords;
});
```

**Returned Array Structure:**
```typescript
[
  {
    _id: Id<"keywords">,
    _creationTime: number,
    orgId: Id<"organizations">,
    keyword: string,
    createdAt: number
  },
  // ...
]
```

---

### `keywords.addKeyword`

**Type**: Mutation  
**File**: `convex/keywords.ts`  
**Purpose**: Adds a new keyword. Enforces plan limits and prevents duplicates.

**Signature:**
```typescript
export const addKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `keyword` (string, required): The search phrase to add

**Returns:**
- `void`

**Behavior:**
1. Gets current organization ID
2. Checks if keyword already exists (using `by_org_keyword` index)
3. Counts current keywords
4. Calls `checkLimit()` to validate against plan limits
5. Inserts new keyword document with `createdAt` timestamp

**Error Cases:**
- **Keyword exists**: Silently returns (idempotent)
- **Limit exceeded**: Throws `Error("Plan limit reached for maxKeywords. Limit: X, Current: Y")`

**Example Usage:**
```javascript
try {
  await convex.mutation(api.keywords.addKeyword, {
    keyword: "restaurant dublin"
  });
  // Success - keyword added
  toast.add({ severity: 'success', summary: 'Dodano słowo kluczowe' });
} catch (error) {
  // Limit exceeded or other error
  toast.add({ severity: 'error', summary: 'Błąd', detail: error.message });
}
```

**Plan Limits:**
- Basic: 10 keywords
- Professional: 50 keywords
- Enterprise: 1000 keywords

---

### `keywords.removeKeyword`

**Type**: Mutation  
**File**: `convex/keywords.ts`  
**Purpose**: Removes a keyword by exact match.

**Signature:**
```typescript
export const removeKeyword = mutation({
    args: { keyword: v.string() },
    handler: async (ctx, args) => Promise<void>
});
```

**Parameters:**
- `keyword` (string, required): The exact keyword to remove

**Returns:**
- `void`

**Behavior:**
1. Gets current organization ID
2. Finds keyword using `by_org_keyword` index
3. Deletes document if found
4. If not found, silently returns (idempotent)

**Example Usage:**
```javascript
await convex.mutation(api.keywords.removeKeyword, {
  keyword: "restaurant dublin"
});
// Keyword removed (or didn't exist)
```

**Error Cases:**
- None (idempotent operation)

---

## SEO API

### `seo.runAuditAction`

**Type**: Action  
**File**: `convex/seo.ts`  
**Purpose**: Triggers a DataForSEO audit and fetches keyword suggestions. Long-running async operation.

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
- `url` (string, required): Target URL to audit
- `orgId` (Id<"organizations">, required): Organization ID

**Returns:**
- `AuditResult`: Complete audit result object

**Workflow:**
1. **POST Task**: Sends request to DataForSEO `v3/on_page/task_post` API
2. **Polling**: Polls `v3/on_page/summary/{taskId}` every 3 seconds (max 30 attempts = 90 seconds)
3. **Fetch Details**: Once complete, fetches detailed page data from `v3/on_page/pages`
4. **Fetch Keywords**: Calls `v3/keywords_data/google_ads/keywords_for_site/live` for keyword suggestions
5. **Save Result**: Calls `saveAuditResult` mutation to store results in database
6. **Return**: Returns formatted result object

**Result Structure:**
```typescript
{
  audit_time: string,              // ISO timestamp
  on_page: {
    meta: {
      title: { value: string, length: number, status: string },
      description: { value: string, length: number, status: string },
      canonical: string,
      h1: string[]
    },
    performance: {
      lcp: number,                 // Largest Contentful Paint (seconds)
      cls: number,                  // Cumulative Layout Shift
      fid: number,                 // First Input Delay (milliseconds)
      score: number                // Overall score (0-100)
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

**Example Usage:**
```javascript
try {
  const result = await convex.action(api.seo.runAuditAction, {
    url: "https://dublinpainters.ie",
    orgId: org._id
  });
  
  console.log(`Score: ${result.on_page.performance.score}`);
  console.log(`Keywords found: ${result.keywords.length}`);
} catch (error) {
  console.error('Audit failed:', error.message);
}
```

**Error Cases:**
- **Missing API Key**: Throws `Error("Missing DATAFORSEO_API_KEY")`
- **API Errors**: Throws `Error("DataForSEO API Error: {message}")`
- **Timeout**: Throws `Error("Audit timed out or failed")` (after 30 polling attempts)

**Environment Variables:**
- `DATAFORSEO_API_KEY`: Required for DataForSEO API access

**Duration:**
- Typically 30-90 seconds (depends on DataForSEO processing time)

---

### `seo.saveAuditResult`

**Type**: Mutation  
**File**: `convex/seo.ts`  
**Purpose**: Saves audit result to database. Updates existing audit if found, otherwise creates new.

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
- `orgId` (Id<"organizations">, required): Organization ID
- `url` (string, required): Audited URL
- `fullResult` (any, required): Complete audit result object
- `score` (number, required): SEO score (0-100)
- `metaTitle` (string, required): Page title

**Returns:**
- `void`

**Behavior:**
- Checks for existing audit using `by_org_url` index
- If exists: Updates with `patch()` (status → "completed", new data)
- If not exists: Creates new document with `insert()`
- Always updates `createdAt` to current timestamp

**Example Usage:**
```javascript
// Called internally by runAuditAction
await ctx.runMutation(api.seo.saveAuditResult, {
  orgId: args.orgId,
  url: args.url,
  fullResult: result,
  score: result.on_page.performance.score,
  metaTitle: result.on_page.meta.title.value
});
```

**Note**: This mutation is typically called internally by `runAuditAction`, not directly from frontend.

---

### `seo.getAudit`

**Type**: Query  
**File**: `convex/seo.ts`  
**Purpose**: Retrieves the latest audit for a specific URL.

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
- `url` (string, required): URL to get audit for
- `orgId` (Id<"organizations">, required): Organization ID

**Returns:**
- `SeoAudit | null`: Audit document or null if not found

**Use Cases:**
- Displaying audit results in UI
- Checking if audit exists before running new one
- Cache checking (if audit is recent, skip new audit)

**Example Usage:**
```javascript
const audit = await convex.query(api.seo.getAudit, {
  url: "https://dublinpainters.ie",
  orgId: org._id
});

if (audit && audit.status === "completed") {
  console.log(`Score: ${audit.score}`);
  console.log(`Title: ${audit.metaTitle}`);
  
  // Check if audit is recent (< 24 hours)
  const age = Date.now() - audit.createdAt;
  const isRecent = age < 1000 * 60 * 60 * 24;
}
```

**Returned Object Structure:**
```typescript
{
  _id: Id<"seoAudits">,
  _creationTime: number,
  orgId: Id<"organizations">,
  url: string,
  status: "pending" | "completed" | "failed",
  dataForSeoTaskId?: string,
  score?: number,
  metaTitle?: string,
  fullResult?: any,
  createdAt: number
}
```

---

## Feature Limits API

### `featureLimits.getPlanLimits`

**Type**: Helper Function (not exported as API)  
**File**: `convex/featureLimits.ts`  
**Purpose**: Gets the limit configuration for an organization's plan.

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

**Returns:**
- `PlanLimits`: Object with limit values for current plan

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
// Used internally in other functions
const limits = await getPlanLimits(ctx, orgId);
console.log(limits.maxKeywords); // 50 (if professional plan)
```

**Note**: This is a helper function, not a Convex API endpoint. Used internally by `checkLimit()`.

---

### `featureLimits.checkLimit`

**Type**: Helper Function (not exported as API)  
**File**: `convex/featureLimits.ts`  
**Purpose**: Validates that current usage is below the plan limit. Throws error if limit exceeded.

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

**Returns:**
- `true` if within limit

**Error Cases:**
- **Limit exceeded**: Throws `Error("Plan limit reached for {featureKey}. Limit: X, Current: Y")`

**Example Usage:**
```typescript
// Used internally in mutations
const currentCount = (await ctx.db
  .query("keywords")
  .withIndex("by_org", (q) => q.eq("orgId", orgId))
  .collect()).length;

await checkLimit(ctx, orgId, "maxKeywords", currentCount);
// Throws if limit exceeded, otherwise returns true
```

**Note**: This is a helper function, not a Convex API endpoint. Used internally by mutations like `keywords.addKeyword`.

---

## API Usage Patterns

### Real-time Subscriptions

All queries support real-time subscriptions via `convex.onUpdate()`:

```javascript
// Subscribe to organization data
const unsubscribe = convex.onUpdate(
  api.organizations.getCurrent,
  {},
  (org) => {
    orgData.value = org;
  }
);

// Cleanup on unmount
onUnmounted(() => {
  unsubscribe();
});
```

### Error Handling

```javascript
try {
  await convex.mutation(api.keywords.addKeyword, { keyword: "test" });
} catch (error) {
  if (error.message.includes("Plan limit reached")) {
    // Handle limit error
  } else {
    // Handle other errors
  }
}
```

### Optimistic Updates

```javascript
// Update UI immediately
localKeywords.value.push({ keyword: "test", createdAt: Date.now() });

try {
  await convex.mutation(api.keywords.addKeyword, { keyword: "test" });
  // Success - subscription will update with real data
} catch (error) {
  // Rollback on error
  localKeywords.value.pop();
}
```
