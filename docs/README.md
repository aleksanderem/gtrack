# GTRACK Documentation

Welcome to the comprehensive technical documentation for GTRACK.

## Overview

GTRACK is a comprehensive SaaS solution for monitoring and managing Google Business Profiles. It provides tools for SEO tracking, review management, and automated reporting.

**Technology Stack:**
- **Frontend**: Vue 3.4.21 (Composition API) + Vite 5.1.6 + PrimeVue 4.0.7 + Tailwind CSS 4.0.0
- **Backend**: Convex 1.29.3 (Backend-as-a-Service)
- **External APIs**: DataForSEO, Google Maps Platform

## Key Features

- **Rank Tracking**: Monitor keyword positions in Google Maps and Search
- **Review Management**: Aggregate and reply to reviews with AI assistance
- **SEO Audits**: Analyze on-page SEO factors using DataForSEO
- **Feature Gating**: Multi-tier subscription plans (Basic, Professional, Enterprise)
- **Real-time Updates**: Automatic UI synchronization with backend changes
- **Map Visualization**: Interactive grid-based ranking visualization

## Quick Start

1. **New to GTRACK?** Start with [Architecture Overview](architecture/overview.md) to understand the system
2. **Setting up?** Follow [Setup & Development Guide](guides/setup.md)
3. **Developing features?** Check [Development Workflow](guides/development.md) (coming soon)
4. **Using the API?** See [Convex API Reference](api/convex.md) and [External Integrations](api/external.md)

## Documentation Structure

### Architecture
- **[Overview](architecture/overview.md)**: System architecture, technology stack, design principles
- **[Backend (Convex)](architecture/backend.md)**: Database schema, functions, security model
- **[Frontend (Vue)](architecture/frontend.md)**: Component structure, state management, routing
- **[Data Flow](architecture/data-flow.md)**: Data flow patterns for each module
- **[Data Evolution](architecture/data-evolution.md)**: Migration status (mock vs real data)

### Components
- **[Views](components/views/)**: Page-level components (LocationMapView, LocationSettingsView, PublicFeedbackView)
- **[Reviews Components](components/reviews/)**: Reviews module components (coming soon)
- **[Settings Components](components/settings/)**: Settings module components (coming soon)
- **[Map Components](components/map/)**: Map visualization components (coming soon)
- **[Common Components](components/common/)**: Shared UI components (coming soon)

### Composables & Stores
- **[useFeatures](composables/use-features.md)**: Feature checking and limit management
- **[featureSettings Store](stores/feature-settings.md)**: Global state for subscription and features
- More composables documentation (coming soon)

### API Reference
- **[Convex API](api/convex.md)**: Complete reference for all backend functions
- **[External Integrations](api/external.md)**: DataForSEO and Google Maps API integration

### Features & Limits
- **[Feature System](features/system.md)**: Feature configuration and hierarchy
- **[Plans & Limits](features/limits.md)**: Subscription plans and limit enforcement
- **[Debug Bar](features/debug-bar.md)**: Development tool for testing features
- **[Keywords](features/keywords.md)**: Keyword tracking feature
- **[Reviews](features/reviews.md)**: Review management feature
- **[SEO Audits](features/seo-audits.md)**: SEO audit feature

### Views & UI
- **[Dashboard (Map)](views/dashboard.md)**: Main dashboard view
- **[Reviews Module](views/reviews.md)**: Reviews management interface
- **[Settings Module](views/settings.md)**: Settings configuration interface

### Guides
- **[Setup & Development](guides/setup.md)**: Installation and development setup
- **[Deployment](guides/deployment.md)**: Production deployment guide
- **[New Feature Guide](guides/new-feature.md)**: How to add new features

## Documentation Principles

This documentation is designed to be:
- **Comprehensive**: Covers all aspects of the system
- **Detailed**: Includes code examples, data structures, and workflows
- **Up-to-date**: Reflects current implementation state
- **AI-Friendly**: Structured for easy understanding by AI systems

## Contributing

When adding new features or making changes:
1. Update relevant documentation sections
2. Add code examples where applicable
3. Document data structures and API changes
4. Update migration status in [Data Evolution](architecture/data-evolution.md)

## Related Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [PrimeVue Documentation](https://primevue.org/)
- [DataForSEO API Documentation](https://dataforseo.com/apis)
