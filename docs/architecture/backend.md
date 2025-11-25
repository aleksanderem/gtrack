# Backend Architecture (Convex)

GTRACK uses [Convex](https://convex.dev) as its backend infrastructure. Convex provides a real-time database, serverless functions, and file storage in a single platform.

## Database Schema

The database is designed around a multi-tenant architecture where the **Organization** is the central entity.

### 1. Organizations (`organizations`)
The root entity representing a tenant (business).

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Display name of the business. |
| `slug` | `string` | Unique identifier for URLs (indexed). |
| `plan` | `union` | Subscription tier: `'basic'`, `'professional'`, `'enterprise'`. |
| `settings` | `object` | Global preferences (`timezone`, `language`). |
| `businessProfile` | `object` | Google Maps data (`placeId`, `cid`, `isConnected`). |
| `gridSettings` | `object` | Scanning config (`maxSize`, `stepKm`, `centerName`, `lat`, `lng`). |
| `featureFlags` | `object` | Toggles for specific features (`autoReply`, `photoMonitoring`, etc.). |

### 2. Users (`users`)
Users are associated with organizations.

| Field | Type | Description |
| :--- | :--- | :--- |
| `tokenIdentifier` | `string` | External Auth ID (e.g., from Clerk/Auth0). |
| `orgId` | `id` | Reference to the `organizations` table. |
| `role` | `union` | `'admin'` or `'member'`. |

### 3. Keywords (`keywords`)
List of phrases monitored for ranking.

| Field | Type | Description |
| :--- | :--- | :--- |
| `orgId` | `id` | Owner organization. |
| `keyword` | `string` | The search phrase. |
| `createdAt` | `number` | Timestamp. |

### 4. SEO Audits (`seoAudits`)
Stores the history and results of on-page SEO scans.

| Field | Type | Description |
| :--- | :--- | :--- |
| `orgId` | `id` | Owner organization. |
| `url` | `string` | The audited URL. |
| `status` | `union` | `'pending'`, `'completed'`, `'failed'`. |
| `dataForSeoTaskId` | `string` | ID from external API. |
| `score` | `number` | Calculated SEO score (0-100). |
| `fullResult` | `json` | Complete raw response from DataForSEO. |

### 5. Feature Usage (`featureUsage`)
Tracks consumption of limited resources (e.g., number of audits run).

| Field | Type | Description |
| :--- | :--- | :--- |
| `featureKey` | `string` | Identifier (e.g., `'seo_audits'`). |
| `periodStart` | `number` | Timestamp of the current billing period start. |
| `count` | `number` | Current usage count. |

## Functions Structure

We organize backend logic into modular files within the `convex/` directory:

- **`schema.ts`**: Database definitions.
- **`organizations.ts`**: Tenant management, settings updates.
- **`keywords.ts`**: Keyword CRUD operations.
- **`seo.ts`**: Integration with DataForSEO (Actions) and audit storage (Mutations).
- **`featureLimits.ts`**: Logic for enforcing plan limits.

## Security & Access Control

Currently, the application uses a simplified model where the "Current Organization" is often hardcoded or fetched via a single query (`organizations.getCurrent`).
In production, every query and mutation validates the `ctx.auth` user and ensures they belong to the `orgId` they are trying to access.
