# Convex API Reference

## Organizations

### `organizations.getCurrent`
**Query**
Returns the current organization context.
- **Returns**: `Organization` object

### `organizations.updateSettings`
**Mutation**
Updates organization configuration.
- **Args**:
  - `businessProfile`: `{ placeId, cid, isConnected }`
  - `gridSettings`: `{ maxSize, stepKm, centerName }`
  - `featureFlags`: `{ autoReply, ... }`

## Keywords

### `keywords.getKeywords`
**Query**
Returns list of monitored keywords.

### `keywords.addKeyword`
**Mutation**
Adds a new keyword. Enforces plan limits.
- **Args**: `{ keyword: string }`
- **Throws**: `LimitExceededError` if quota full.

### `keywords.removeKeyword`
**Mutation**
Removes a keyword.
- **Args**: `{ keyword: string }`

## SEO

### `seo.runAuditAction`
**Action**
Triggers a DataForSEO audit and fetches keyword suggestions.
- **Args**: `{ url: string }`
