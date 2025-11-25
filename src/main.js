import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Lara from '@primeuix/themes/lara'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import App from './App.vue'
import router from './router'

// Import Tailwind CSS with PrimeUI plugin
import './styles.css'

// Import icons
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './primeflex-overrides.css'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Customize Lara preset to use BLUE as primary color (matching V3 Lara Light Blue)
const LaraBlue = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: LaraBlue,
        options: {
            darkModeSelector: false,
            cssLayer: false
        }
    }
})

app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.mount('#app')
