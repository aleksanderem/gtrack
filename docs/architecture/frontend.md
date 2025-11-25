# Frontend Architecture (Vue 3)

The frontend is built with **Vue 3** using the **Composition API** and **Vite**.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── gtrack/         # Domain-specific components
│   │   ├── settings/   # Settings forms (Business, Keywords, etc.)
│   │   ├── reviews/    # Reviews management UI
│   │   └── sidebar/    # Navigation and Grid Config
├── views/              # Page-level components (Router targets)
├── stores/             # Pinia global state stores
├── composables/        # Shared logic (Hooks)
├── services/           # API wrappers (Legacy/Transition)
└── config/             # Static configuration (Plans, Features)
```

## State Management

We use a hybrid approach for state management:

### 1. Pinia Stores
Used for global, app-wide state that needs to be accessed by many unrelated components.
- **`featureSettings.js`**: Stores the current state of feature flags (enabled/disabled) and syncs them with the backend settings.

### 2. Composables (`use...`)
Used for encapsulating logic and shared state related to specific domains.
- **`useLocationData.js`**: Manages the "current location" context, including keywords and grid settings.
- **`useFeatures.js`**: Provides helper methods (`hasFeature`, `getLimit`) to check permissions against the current plan.

### 3. Convex Reactivity
For data that comes directly from the backend, we often skip the store and use `convex.onUpdate` directly in components. This ensures the UI is always 100% in sync with the database without manual store updates.

## UI & Styling

### PrimeVue
We use [PrimeVue](https://primevue.org/) in **Unstyled Mode**. This gives us the complex functionality of components (Datatables, Dialogs, AutoComplete) without the opinionated styles.

### Tailwind CSS
All styling is applied via Tailwind utility classes.
- **Presets**: We use a PrimeVue Tailwind preset to apply base styles to PrimeVue components.
- **Customization**: Global styles are defined in `src/styles.css` (e.g., the `.pi` icon fix).

## Routing
Vue Router handles navigation.
- **`/`**: Dashboard / Map View.
- **`/settings`**: Location Settings (Business, Keywords, Schedule).
