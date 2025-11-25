# Backend (Convex)

## Schema Design
The database is centered around the **Organization** (Tenant) model.

### Core Tables

#### `organizations`
The root entity for multi-tenancy.
```typescript
{
  name: string,
  slug: string,
  plan: "basic" | "professional" | "enterprise",
  settings: { timezone: string, language: string },
  // Business Data
  businessProfile: { placeId: string, cid: string, ... },
  // Configuration
  gridSettings: { maxSize: number, stepKm: number, ... },
  featureFlags: { autoReply: boolean, ... }
}
```

#### `keywords`
Monitored phrases for ranking.
```typescript
{
  orgId: Id<"organizations">,
  keyword: string,
  createdAt: number
}
```

#### `seoAudits`
History of on-page audits.
```typescript
{
  orgId: Id<"organizations">,
  url: string,
  status: "pending" | "completed" | "failed",
  fullResult: object // JSON from DataForSEO
}
```

## Integration Patterns

### Queries (Read)
We use `convex.onUpdate` for real-time data subscriptions.

```javascript
// Frontend usage
onMounted(() => {
  unsubscribe = convex.onUpdate(api.keywords.getKeywords, {}, (data) => {
    keywords.value = data;
  });
});
```

### Mutations (Write)
We use `convex.mutation` for data modification.

```javascript
// Frontend usage
await convex.mutation(api.keywords.addKeyword, {
  keyword: "new keyword"
});
```

### Actions (Async)
Used for third-party API calls (e.g., DataForSEO). Actions fetch data and then call internal mutations to save it.
