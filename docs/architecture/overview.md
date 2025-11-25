# Architecture Overview

## Technology Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Library**: PrimeVue (Unstyled mode with Tailwind presets)
- **Styling**: Tailwind CSS
- **State Management**: Pinia (for global feature flags) + Vue Reactivity

### Backend
- **Platform**: [Convex](https://convex.dev) (Backend-as-a-Service)
- **Database**: Real-time document database
- **Functions**: Serverless TypeScript functions (Queries, Mutations, Actions)

### External Services
- **DataForSEO**: Provides SEO metrics, keyword data, and SERP results.
- **Google Maps API**: Used for place autocomplete and map visualization.

## Data Flow
1.  **Real-time Sync**: The frontend subscribes to Convex queries using `convex.onUpdate`.
2.  **Optimistic Updates**: UI updates immediately while mutations are processed.
3.  **Background Jobs**: Heavy tasks (like SEO audits) run as Convex Actions, updating the DB asynchronously.
