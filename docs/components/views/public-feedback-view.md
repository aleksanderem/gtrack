# PublicFeedbackView Component

**File**: `src/views/PublicFeedbackView.vue`  
**Route**: `/feedback/:locationId` (public route, no authentication)  
**Purpose**: Public feedback form for collecting customer reviews before they post to Google

## Overview

`PublicFeedbackView` is a public-facing component that allows customers to leave feedback. Based on their rating, it either redirects them to Google (for positive reviews) or collects private feedback (for negative reviews).

## Component Structure

```
PublicFeedbackView.vue
├── Header Image (Google Reviews branding)
├── Business Header
│   ├── Logo
│   ├── Business Name
│   └── Headline
├── Content Area
│   ├── Rating Input (Initial State)
│   ├── Negative Feedback Form (if rating < threshold)
│   ├── Redirect State (if rating >= threshold)
│   ├── Success State (after submission)
│   └── Loading State
└── Footer (Powered by GTRACK)
```

## Props

```typescript
{
  previewMode?: boolean;        // If true, doesn't fetch real data
  previewSettings?: object;     // Settings for preview mode
}
```

## Events

None

## Data Sources

### Mock Service (Current)
- **Settings**: `ReviewsService.getAcquisitionSettings()`
  - Returns mock acquisition settings
  - Includes form fields, theme, business info

### Real Data (Future)
- Will fetch from Convex based on `locationId` route parameter
- Settings stored in `organizations` or separate `acquisitionSettings` table

## State Management

### Local State
```javascript
const loading = ref(true);           // Initial loading state
const submitting = ref(false);       // Form submission state
const submitted = ref(false);        // Success state
const step = ref(null);              // Current step: null | 'form' | 'redirect'
const rating = ref(0);               // Selected rating (1-5)
const settings = ref({});            // Acquisition settings
const errors = ref({});               // Form validation errors
const formData = ref({                // Form field values
  message: ''
});
```

### Computed Properties
```javascript
const isMobilePreview = computed(() => {
  return props.previewMode && props.previewSettings?.device === 'mobile';
});

const currentSettings = computed(() => {
  return props.previewMode && props.previewSettings 
    ? props.previewSettings 
    : settings.value;
});

const formFields = computed(() => {
  return currentSettings.value.form_fields || [];
});
```

## Methods

### `fetchSettings()`
Fetches acquisition settings for the location.

**Flow:**
1. If `previewMode`, skips fetch
2. Calls `ReviewsService.getAcquisitionSettings()`
3. Sets `settings.value`
4. Initializes `formData` with visible fields
5. Sets `loading.value = false`

**Future**: Will use Convex query with `locationId` from route

### `handleRating()`
Handles rating selection and determines next step.

**Flow:**
1. Gets `min_rating_for_google` threshold (default: 4)
2. If `rating >= threshold`:
   - Sets `step = 'redirect'`
   - After 1.5s, redirects to Google review page
3. If `rating < threshold`:
   - Sets `step = 'form'` (show feedback form)

**Redirect Logic:**
```javascript
const placeId = currentSettings.value.google_place_id;
const url = placeId 
  ? `https://search.google.com/local/writereview?placeid=${placeId}`
  : 'https://google.com';
window.location.href = url;
```

### `validateForm()`
Validates form before submission.

**Validation Rules:**
- All required fields must be filled
- `message` field is always required

**Returns:**
- `true` if valid
- `false` if invalid (sets `errors` object)

### `submitForm()`
Submits negative feedback to backend.

**Flow:**
1. Validates form
2. Sets `submitting.value = true`
3. Creates feedback object:
   ```javascript
   {
     rating: rating.value,
     ...formData.value
   }
   ```
4. Calls `ReviewsService.saveInternalFeedback(feedback)`
5. Sets `submitted.value = true`
6. Sets `submitting.value = false`

**Future**: Will save to Convex `interceptedReviews` table

## Lifecycle Hooks

### `onMounted()`
- Calls `fetchSettings()`

## Watchers

### `watch(() => props.previewSettings, ...)`
Watches for preview settings changes.

**Purpose:**
- Resets state when preview settings change (if needed)

## Component States

### 1. Loading State
- Shows spinner
- Fetches settings

### 2. Rating Input State (`step === null`)
- Shows rating component
- User selects 1-5 stars
- Triggers `handleRating()` on change

### 3. Negative Feedback Form (`step === 'form'`)
- Shows form with dynamic fields
- Includes message textarea
- Submit button

### 4. Redirect State (`step === 'redirect'`)
- Shows "Redirecting to Google" message
- Redirects after 1.5s delay
- Only for ratings >= threshold

### 5. Success State (`submitted === true`)
- Shows success message
- "Dziękujemy!" with checkmark icon

## Settings Structure

```typescript
{
  business_name: string;
  headline: string;
  logo_url?: string;
  theme_color: string;              // Hex color (without #)
  font_family?: string;
  min_rating_for_google: number;   // Default: 4
  google_place_id?: string;
  form_fields: Array<{
    key: string;
    label: string;
    type: string;
    required: boolean;
    visible: boolean;
  }>;
}
```

## Form Fields

### Dynamic Fields
- Loaded from `settings.form_fields`
- Only visible fields are shown
- Required fields are validated

### Message Field
- Always visible
- Always required
- Textarea with auto-resize

## Styling

### Theme Color
- Applied as border-top color on header
- Format: `borderTop: '6px solid #${theme_color}'`

### Font Family
- Applied to root element
- Default: 'Inter, sans-serif'

### Responsive
- Mobile preview mode: Full screen, no rounded corners
- Desktop: Centered card with rounded corners

## Usage Example

### As Route Component
```javascript
// router/index.js
{
  path: '/feedback/:locationId',
  name: 'public-feedback',
  component: PublicFeedbackView
}
```

### In Preview Mode
```vue
<PublicFeedbackView 
  :preview-mode="true"
  :preview-settings="{
    business_name: 'Test Business',
    theme_color: '3B82F6',
    form_fields: [...]
  }"
/>
```

## Related Components

- `ReviewsService.js`: Mock service for settings and feedback submission
- `AcquisitionPanel.vue`: Settings editor for this form (in Reviews module)

## Dependencies

- `vue`: Composition API, lifecycle hooks, watchers
- `vue-router`: Route parameters
- `primevue`: Rating, InputText, Textarea, Button
- `ReviewsService.js`: Mock service

## Future Enhancements

1. **Convex Integration**: Fetch settings from backend
2. **Real Feedback Storage**: Save to `interceptedReviews` table
3. **Analytics**: Track conversion rates
4. **Customization**: More theme options, custom CSS
5. **Multi-language**: Support for multiple languages
6. **QR Code**: Generate QR codes for physical materials
