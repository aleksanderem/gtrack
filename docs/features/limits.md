# Plans & Limits

## Limit Logic
Limits are defined in `src/config/features.js` and enforced on both frontend and backend.

### Defined Limits
| Feature | Basic | Professional | Enterprise |
| :--- | :--- | :--- | :--- |
| **Keywords** | 10 | 50 | 1000 |
| **Audits** | 5 / mo | 20 / mo | Unlimited |
| **Users** | 1 | 5 | Unlimited |

## Enforcement

### Backend (`convex/featureLimits.ts`)
Before any resource creation, the backend checks the current usage against the plan limit.

```typescript
// convex/keywords.ts
export const addKeyword = mutation({
  handler: async (ctx, args) => {
    await checkLimit(ctx, ctx.orgId, "maxKeywords");
    // ... proceed to insert
  }
});
```

### Frontend
The UI proactively disables actions when limits are reached.

```javascript
// KeywordsSettings.vue
const isLimitReached = computed(() => keywords.length >= limit);
```
