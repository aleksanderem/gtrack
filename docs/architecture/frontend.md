# Frontend Architecture (Vue 3)

The frontend is built with **Vue 3.4.21** using the **Composition API** with `<script setup>` syntax and **Vite 5.1.6** as the build tool.

## Project Structure

```
src/
├── App.vue                    # Root component (router-view only)
├── main.js                    # Application entry point, PrimeVue setup
├── convex.js                  # Convex client singleton
├── styles.css                 # Global styles and Tailwind imports
├── primeflex-overrides.css    # PrimeFlex utility overrides
│
├── components/                 # Reusable UI components
│   └── gtrack/                # Domain-specific GTRACK components
│       ├── common/            # Shared components
│       │   ├── LimitProgressBar.vue
│       │   └── LimitWarningBanner.vue
│       ├── debug/             # Development tools
│       │   └── FeatureDebugBar.vue
│       ├── map/               # Map visualization
│       │   └── GoogleMapView.vue
│       ├── reviews/           # Reviews module (15 components)
│       │   ├── ReviewsDashboard.vue (container)
│       │   ├── ReviewsOverview.vue
│       │   ├── ReviewsList.vue
│       │   ├── ReviewItem.vue
│       │   ├── InterceptedReviews.vue
│       │   ├── AcquisitionPanel.vue
│       │   ├── AutoReplySettings.vue
│       │   ├── AutoReplyHistory.vue
│       │   ├── ResponseTemplates.vue
│       │   ├── AIAnalysis.vue
│       │   ├── ReviewsStats.vue
│       │   ├── TemplateSelector.vue
│       │   ├── DeveloperMenu.vue
│       │   ├── FeatureCard.vue
│       │   └── PositionControls.vue
│       ├── settings/          # Settings module (7 components)
│       │   ├── SettingsLayout.vue
│       │   ├── SettingsNavigation.vue
│       │   ├── BusinessSettings.vue
│       │   ├── KeywordsSettings.vue
│       │   ├── FrequencySettings.vue
│       │   ├── NotificationSettings.vue
│       │   └── FeatureLicenseBadge.vue
│       ├── sidebar/           # Sidebar components
│       │   ├── GridConfiguration.vue
│       │   ├── KeywordsManager.vue
│       │   ├── LocationHeader.vue
│       │   ├── LocationInfoPanel.vue
│       │   └── MapTrafficStats.vue
│       ├── BusinessPanel.vue  # Business info panel
│       ├── LeftSidebar.vue    # Main left sidebar
│       ├── FarLeftNavbar.vue  # Far left navigation
│       ├── TopBar.vue         # Top navigation bar
│       └── HorizontalCalendar.vue
│
├── views/                     # Page-level components (Router targets)
│   ├── LocationMapView.vue    # Main dashboard / map view
│   ├── LocationSettingsView.vue # Settings page
│   └── PublicFeedbackView.vue  # Public feedback form
│
├── layouts/                    # Layout components
│   └── DashboardLayout.vue    # Main app layout with sidebars
│
├── router/                     # Vue Router configuration
│   └── index.js               # Route definitions
│
├── stores/                     # Pinia stores
│   └── featureSettings.js     # Global feature flags and subscription state
│
├── composables/                # Composition API composables
│   ├── useFeatures.js         # Feature checking and limits
│   ├── useLocationData.js     # Mock location data (legacy)
│   ├── useFeatureFlags.js     # Feature flags management
│   ├── useFeatureLimits.js    # Limit checking helpers
│   └── featureHierarchy.js    # Feature hierarchy structure
│
├── services/                   # API service wrappers
│   ├── ReviewsService.js      # Mock reviews service
│   ├── SeoService.js          # SEO audit service (Convex integration)
│   └── KeywordsService.js     # Mock keywords service
│
└── config/                     # Static configuration
    └── features.js            # Feature definitions, plans, limits
```

## Vue 3 Patterns

### Composition API with `<script setup>`

All components use the `<script setup>` syntax for better performance and TypeScript support.

**Example Component Structure:**
```vue
<template>
  <div class="component-container">
    <!-- Template content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

// Props
const props = defineProps({
  value: { type: String, required: true }
});

// Emits
const emit = defineEmits(['update:value', 'change']);

// Reactive state
const localValue = ref(props.value);
const loading = ref(false);

// Computed properties
const isValid = computed(() => localValue.value.length > 0);

// Methods
const handleChange = () => {
  emit('update:value', localValue.value);
  emit('change', localValue.value);
};

// Lifecycle
onMounted(() => {
  // Setup logic
});

// Watchers
watch(() => props.value, (newValue) => {
  localValue.value = newValue;
});
</script>

<style scoped>
/* Component styles */
</style>
```

### Key Vue 3 Features Used

1. **Reactive References** (`ref`): For primitive values and objects
2. **Computed Properties** (`computed`): For derived state
3. **Watchers** (`watch`, `watchEffect`): For side effects
4. **Lifecycle Hooks** (`onMounted`, `onUnmounted`, etc.): For setup/cleanup
5. **Template Refs** (`ref` in template): For DOM access
6. **Provide/Inject**: For dependency injection (not currently used, but available)

## State Management

We use a hybrid approach for state management, choosing the right tool for each use case:

### 1. Pinia Stores
**When to use:** Global, app-wide state that needs to be accessed by many unrelated components.

**Current Store:**
- **`featureSettings.js`**: 
  - Subscription state (plan, name)
  - Feature flags enabled/disabled state
  - Usage tracking (mock)
  - Feature plan overrides (for debug bar)
  - Feature limit overrides (for debug bar)
  - Persisted to localStorage

**Store Pattern:**
```javascript
import { ref, reactive, computed } from 'vue';

const state = reactive({
  subscription: { plan: 'basic', name: 'Basic' },
  usage: {},
  featureSettings: {}
});

export function useFeatureSettings() {
  const loadSettings = async () => {
    // Load from localStorage or API
  };
  
  const updateSubscription = async (plan) => {
    state.subscription.plan = plan;
    localStorage.setItem('subscription', JSON.stringify(state.subscription));
  };
  
  return {
    subscription: computed(() => state.subscription),
    usage: computed(() => state.usage),
    loadSettings,
    updateSubscription
  };
}
```

### 2. Composables (`use...`)
**When to use:** Encapsulating logic and shared state related to specific domains. Can use stores or Convex directly.

**Available Composables:**
- **`useFeatures.js`**: Feature checking (`can()`, `isLocked()`, `getLimit()`, `checkLimit()`)
- **`useLocationData.js`**: Mock location data (legacy, being migrated)
- **`useFeatureFlags.js`**: Feature flags management with plan checking
- **`useFeatureLimits.js`**: Limit checking helpers

**Composable Pattern:**
```javascript
import { computed } from 'vue';
import { useFeatureSettings } from '../stores/featureSettings';
import { FEATURES, PLAN_LEVELS } from '../config/features';

export function useFeatures() {
  const { subscription } = useFeatureSettings();
  
  const can = (featureKey) => {
    const feature = FEATURES[featureKey];
    const requiredLevel = PLAN_LEVELS[feature.requiredPlan] || 0;
    const currentLevel = PLAN_LEVELS[subscription.value.plan] || 0;
    return currentLevel >= requiredLevel;
  };
  
  return { can };
}
```

### 3. Convex Reactivity
**When to use:** Data that comes directly from the backend. Ensures UI stays in sync with database automatically.

**Pattern:**
```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

const keywords = ref([]);
let unsubscribe = null;

onMounted(() => {
  unsubscribe = convex.onUpdate(api.keywords.getKeywords, {}, (newKeywords) => {
    keywords.value = newKeywords;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
```

**Benefits:**
- Automatic updates when database changes
- No manual store synchronization needed
- Real-time collaboration support
- Type-safe with generated API types

### State Management Decision Tree

```
Is the data from the backend?
├─ Yes → Use Convex Reactivity (convex.onUpdate)
└─ No → Is it global app state?
    ├─ Yes → Use Pinia Store
    └─ No → Is it reusable logic?
        ├─ Yes → Use Composable
        └─ No → Use component-local state (ref/reactive)
```

## Routing Structure

Vue Router 4.6.3 handles all navigation. Routes are defined in `src/router/index.js`.

### Route Hierarchy

```
/ (root)
├─ /feedback/:locationId (PublicFeedbackView) - Public route, no auth
└─ /:locationId (DashboardLayout) - Protected routes
   ├─ /map (LocationMapView) - Default route
   ├─ /reviews (ReviewsDashboard) - Nested routes
   │  ├─ /overview (ReviewsOverview) - Default
   │  ├─ /reviews (ReviewsList)
   │  ├─ /acquisition (AcquisitionPanel)
   │  ├─ /intercepted (InterceptedReviews)
   │  ├─ /templates (ResponseTemplates)
   │  ├─ /auto-reply (AutoReplySettings)
   │  └─ /auto-reply/history (AutoReplyHistory)
   ├─ /settings (LocationSettingsView) - Settings with tabs
   ├─ /posts (Placeholder)
   ├─ /content (Placeholder)
   ├─ /keywords (Placeholder - Report)
   └─ /comparison (Placeholder - Report)
```

### Route Configuration

```javascript
{
  path: '/:locationId',
  component: DashboardLayout,
  children: [
    {
      path: 'map',
      name: 'map',
      component: LocationMapView,
      meta: { label: 'Mapa' }
    },
    {
      path: 'reviews',
      component: ReviewsDashboard,
      children: [
        {
          path: 'overview',
          name: 'reviews-overview',
          component: ReviewsOverview
        },
        // ... more nested routes
      ]
    }
  ]
}
```

### Navigation Patterns

1. **Programmatic Navigation:**
```javascript
import { useRouter } from 'vue-router';

const router = useRouter();
router.push({ name: 'reviews-overview', params: { locationId: 'demo-location' } });
```

2. **Route Parameters:**
```javascript
import { useRoute } from 'vue-router';

const route = useRoute();
const locationId = route.params.locationId; // 'demo-location'
```

3. **Route Meta:**
```javascript
// Access route meta in components
const route = useRoute();
console.log(route.meta.label); // 'Mapa'
```

## Component Hierarchy

### Main Application Layout

```
App.vue
└── router-view
    └── DashboardLayout.vue
        ├── FarLeftNavbar.vue
        ├── LeftSidebar.vue
        │   ├── LocationHeader.vue
        │   ├── LocationInfoPanel.vue
        │   ├── MapTrafficStats.vue
        │   └── GridConfiguration.vue
        ├── TopBar.vue
        ├── HorizontalCalendar.vue (conditional)
        ├── router-view (main content)
        │   ├── LocationMapView.vue
        │   │   ├── BusinessPanel.vue
        │   │   └── GoogleMapView.vue
        │   ├── LocationSettingsView.vue
        │   │   └── SettingsLayout.vue
        │   │       ├── SettingsNavigation.vue
        │   │       └── [Tab Components]
        │   └── ReviewsDashboard.vue
        │       ├── [Tab Navigation]
        │       └── router-view (nested)
        │           └── [Review Sub-components]
        └── FeatureDebugBar.vue (dev only)
```

### Component Communication Patterns

1. **Props Down, Events Up:**
```vue
<!-- Parent -->
<ChildComponent 
  :value="parentValue" 
  @update:value="parentValue = $event" 
/>

<!-- Child -->
<script setup>
const props = defineProps(['value']);
const emit = defineEmits(['update:value']);
</script>
```

2. **Provide/Inject** (not currently used, but available for deep nesting)

3. **Composables** (shared state/logic)

4. **Stores** (global state)

5. **Convex Reactivity** (backend data)

## UI & Styling

### PrimeVue Configuration

PrimeVue 4.0.7 is configured in **Unstyled Mode** with a custom Lara Blue preset.

**Setup (`main.js`):**
```javascript
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

// Customize Lara preset to use BLUE as primary color
const LaraBlue = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      // ... full blue palette
    }
  }
});

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: LaraBlue,
    options: {
      darkModeSelector: false,
      cssLayer: false
    }
  }
});
```

**Registered Directives:**
- `v-tooltip`: Tooltip directive
- `v-ripple`: Ripple effect directive

**Registered Services:**
- `ConfirmationService`: Confirmation dialogs
- `ToastService`: Toast notifications
- `DialogService`: Dynamic dialogs

**Available Components:**
All PrimeVue components are available via auto-import (no explicit imports needed in most cases):
- `Button`, `InputText`, `DataTable`, `Dialog`, `Dropdown`, `SelectButton`, etc.

### Tailwind CSS

Tailwind CSS 4.0.0 is used for all styling via utility classes.

**Configuration (`tailwind.config.js`):**
```javascript
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './example/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

**PostCSS Configuration (`postcss.config.js`):**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
```

**PrimeVue Tailwind Integration:**
- Uses `tailwindcss-primeui` plugin for base PrimeVue component styles
- PrimeVue components receive Tailwind utility classes automatically
- Custom styles in `src/styles.css` for overrides

**Styling Approach:**
1. **Utility-First**: Use Tailwind classes for most styling
2. **Component Scoped**: Use `<style scoped>` for component-specific styles
3. **Global Overrides**: Use `styles.css` for global fixes (e.g., `.pi` icon fix)
4. **PrimeFlex**: Additional utility classes via `primeflex/primeflex.css`

### Custom CSS

**Global Styles (`src/styles.css`):**
- Tailwind imports (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- PrimeIcons CSS
- PrimeFlex CSS
- Custom overrides (e.g., `.pi` icon font fix)

**PrimeFlex Overrides (`primeflex-overrides.css`):**
- Customizations to PrimeFlex utility classes

## Build Process & Configuration

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  }
});
```

**Build Commands:**
- `npm run dev`: Start development server (Vite dev server on port 3000)
- `npm run build`: Production build (outputs to `dist/`)
- `npm run preview`: Preview production build locally

### Development Workflow

1. **Start Backend**: `npx convex dev` (syncs schema and functions)
2. **Start Frontend**: `npm run dev` (Vite dev server)
3. **Hot Module Replacement**: Changes automatically reload
4. **Type Safety**: Convex generates TypeScript types in `convex/_generated/`

### Production Build

1. **Build**: `npm run build` creates optimized bundle in `dist/`
2. **Static Assets**: Images, fonts, etc. are copied to `dist/assets/`
3. **Code Splitting**: Vite automatically splits code for optimal loading
4. **Tree Shaking**: Unused code is removed

## Code Organization Principles

### File Naming
- **Components**: PascalCase (`ReviewsDashboard.vue`)
- **Composables**: camelCase with `use` prefix (`useFeatures.js`)
- **Stores**: camelCase (`featureSettings.js`)
- **Services**: PascalCase (`ReviewsService.js`)
- **Config**: camelCase (`features.js`)

### Import Organization
```javascript
// 1. Vue core
import { ref, computed, onMounted } from 'vue';

// 2. Vue ecosystem
import { useRouter, useRoute } from 'vue-router';

// 3. PrimeVue components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// 4. Internal - composables
import { useFeatures } from '../composables/useFeatures';

// 5. Internal - stores
import { useFeatureSettings } from '../stores/featureSettings';

// 6. Internal - services
import { ReviewsService } from '../services/ReviewsService';

// 7. Internal - Convex
import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

// 8. Internal - components
import ReviewItem from './ReviewItem.vue';
```

### Component Structure Order
1. Template
2. Script (with setup)
3. Style (scoped)

### Composable Structure
1. Imports
2. Helper functions (if any)
3. Main composable function
4. Return object

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Routes are code-split automatically by Vue Router
2. **Computed Properties**: Use `computed()` for derived state (cached)
3. **v-show vs v-if**: Use `v-show` for frequent toggles, `v-if` for conditional rendering
4. **List Rendering**: Use `key` attributes for efficient list updates
5. **Convex Subscriptions**: Unsubscribe in `onUnmounted` to prevent memory leaks

### Bundle Size
- PrimeVue components are tree-shaken (only used components included)
- Tailwind CSS is purged (only used classes included)
- Convex client is optimized for production

## Testing Approach

### Playwright Tests
- Test scripts in root directory (`test-*.mjs`)
- Visual regression testing with screenshots
- HTML snapshot generation for reference

### Manual Testing
- Feature Debug Bar for testing different plans/limits
- Developer Menu in Reviews for scenario testing
- Browser DevTools for debugging

## Future Considerations

### Planned Improvements
1. **TypeScript Migration**: Gradual migration to TypeScript for better type safety
2. **Component Library**: Extract reusable components to separate package
3. **Storybook**: Component documentation and visual testing
4. **Unit Tests**: Vitest for component and composable testing
5. **E2E Tests**: More comprehensive Playwright test coverage
