<template>
  <div class="gtrack-app h-screen flex relative lg:static bg-gray-100 overflow-hidden">
    <FarLeftNavbar />

    <LeftSidebar
      :location="location"
      :keywords="keywords"
      :editMode="editMode"
      :sidebarView="sidebarView"
      :traffic-summary="trafficSummary"
      :traffic-sources="trafficSources"
      :traffic-loading="trafficLoading"
      @update:sidebarView="sidebarView = $event"
      @update:keywords="keywords = $event"
      @toggle-edit="editMode = !editMode"
    />

    <div class="flex-1 flex flex-col">
      <TopBar
        :activeTab="activeTab"
        :reportOptions="reportOptions"
        :selectedReport="selectedReport"
        :isLoadingReport="isLoadingReport"
        @update:activeTab="activeTab = $event"
        @update:selectedReport="handleReportChange"
        @generate-pdf="generatePDF"
        @generate-csv="generateCSV"
      />

      <HorizontalCalendar v-if="activeTab !== 'settings' && activeTab !== 'reviews'" @date-selected="onDateSelected" />

      <div class="flex-1 flex flex-col overflow-hidden">
        <div v-if="activeTab === 'map'" class="p-4 flex gap-3 flex-1 overflow-hidden">
          <BusinessPanel
            :userPosition="userPosition"
            :visibilityPercent="visibilityPercent"
            :difficulty="difficulty"
            :keywordsCount="keywords.length"
            :competitors="competitors"
            :isLoading="isLoadingBusinessData"
            @open-in-google="openInGoogle"
          />

          <div class="bg-white rounded p-3 flex-1 border border-gray-200">
            <GoogleMapView
              :gridConfig="gridConfig"
              :refreshKey="mapRefreshKey"
              @marker-selected="onMarkerSelected"
              @business-panel-open="onBusinessPanelOpen"
              @grid-size-change="onGridSizeChange"
            />
          </div>
        </div>

        <div v-else-if="activeTab === 'settings'" class="flex-1 overflow-auto bg-surface-50">
          <div class="bg-white border-b border-gray-200">
            <div class="mx-auto flex items-center justify-between gap-4 px-6 py-5 lg:px-12" style="max-width: 1200px;">
              <h1 class="text-gray-900 font-semibold text-xl lg:text-2xl m-0">Ustawienia projektu</h1>
              <div class="flex items-center gap-2">
                <Button label="Anuluj" severity="secondary" outlined @click="activeTab = 'map'" />
                <Button label="Zapisz ustawienia" icon="pi pi-check" @click="saveSettings" />
              </div>
            </div>
          </div>

          <div class="mx-auto w-full px-6 pt-6 pb-10 lg:px-12" style="max-width: 1200px;">
            <SettingsLayout
              v-model="settingsTab"
              :items="settingsNavItems"
              title="Domyślna konfiguracja siatki"
              subtitle="Dostosuj ilość punktów oraz odstępy, aby dopasować pomiar do charakterystyki miasta. Większa siatka daje precyzyjniejszy obraz, mniejsza – szybsze wyniki."
              nav-title="Sekcje"
            >
            <BusinessSettings
                v-if="settingsTab === 'business'"
                v-model="businessConfig"
              />
            <GridConfiguration
                v-else-if="settingsTab === 'scanning'"
                v-model:gridSize="gridConfig.maxSize"
                v-model:stepKm="gridConfig.stepKm"
                v-model:centerName="gridConfig.centerName"
                @search-location="handleLocationSearch"
              />
              <KeywordsSettings 
                v-else-if="settingsTab === 'keywords'" 
                v-model:keywords="keywords"
              />
              <FrequencySettings v-else-if="settingsTab === 'frequency'" />
              <NotificationSettings v-else />
            </SettingsLayout>
          </div>
        </div>

        <div v-else-if="activeTab === 'reviews'" class="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <ReviewsDashboard />
        </div>

        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center text-gray-500 space-y-2">
            <i class="pi pi-inbox text-5xl text-gray-400"></i>
            <p>Widok {{ activeTab.toUpperCase() }} jest w przygotowaniu.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from 'vue'
import FarLeftNavbar from './components/gtrack/FarLeftNavbar.vue'
import LeftSidebar from './components/gtrack/LeftSidebar.vue'
import TopBar from './components/gtrack/TopBar.vue'
import HorizontalCalendar from './components/gtrack/HorizontalCalendar.vue'
import BusinessPanel from './components/gtrack/BusinessPanel.vue'
import GoogleMapView from './components/gtrack/map/GoogleMapView.vue'
import GridConfiguration from './components/gtrack/sidebar/GridConfiguration.vue'
import KeywordsSettings from './components/gtrack/settings/KeywordsSettings.vue'
import BusinessSettings from './components/gtrack/settings/BusinessSettings.vue'
import FrequencySettings from './components/gtrack/settings/FrequencySettings.vue'
import NotificationSettings from './components/gtrack/settings/NotificationSettings.vue'
import ReviewsDashboard from './components/gtrack/reviews/ReviewsDashboard.vue'
import SettingsLayout from './components/gtrack/settings/SettingsLayout.vue'
import Button from 'primevue/button'

const location = ref({
  name: 'Dublin City Center',
  address: '123 O\'Connell Street',
  city: 'Dublin',
  postal: 'D01 F5P2',
  phone: '+353 1 234 5678',
  status: 'Active',
  lat: 53.3498,
  lng: -6.2603
})

const keywords = ref([
  'restaurant dublin',
  'best food dublin',
  'italian restaurant'
])

const gridConfig = ref({
  currentSize: 9,
  maxSize: 9,
  stepKm: 1,
  centerLat: location.value.lat,
  centerLng: location.value.lng,
  centerName: `${location.value.address}, ${location.value.city}`
})

const reportOptions = ref([
  { code: 'keyword1', name: 'restaurant dublin' },
  { code: 'keyword2', name: 'best food dublin' },
  { code: 'keyword3', name: 'italian restaurant' }
])

const selectedReport = ref(reportOptions.value[0])
const isLoadingReport = ref(false)

const userPosition = ref(9)
const visibilityPercent = ref(60)
const difficulty = ref('ŚREDNIA')
const isLoadingBusinessData = ref(false)
const competitors = ref([])

const editMode = ref(false)
const sidebarView = ref('stats')
const activeTab = ref('map')
const mapRefreshKey = ref(0)
const selectedRanking = ref(null)
  const settingsTab = ref('business')
  const trafficLoading = ref(true)

const businessConfig = ref({
  placeId: 'ChIJ...',
  cid: '',
  isConnected: false,
  autoReply: false,
  syncPhotos: true,
  autoPost: false,
  protectData: true,
  monitorQA: false,
  syncHours: false
})

const settingsNavItems = [
  {
    id: 'business',
    label: 'Ustawienia wizytówki',
    description: 'Identyfikacja i integracja Google',
    icon: 'pi pi-briefcase'
  },
  {
    id: 'scanning',
    label: 'Ustawienia skanowania',
    description: 'Siatka, odstępy i punkt centralny',
    icon: 'pi pi-th-large'
  },
  {
    id: 'keywords',
    label: 'Słowa kluczowe',
    description: 'Zarządzanie frazami do monitorowania',
    icon: 'pi pi-tags'
  },
  {
    id: 'frequency',
    label: 'Harmonogram',
    description: 'Częstotliwość i automatyzacja skanów',
    icon: 'pi pi-clock'
  },
  {
    id: 'notifications',
    label: 'Powiadomienia',
    description: 'Alerty e-mail i push',
    icon: 'pi pi-bell'
  }
]

const trafficSummary = computed(() => ({
  title: 'Traffic Distribution',
  primary: {
    id: 'all-traffic',
    label: 'All Traffic',
    value: '1,250 Visits',
    bars: [22, 14, 19, 19, 17, 24],
    trend: 'up', // 'up', 'down', 'stable'
    iconType: 'svg',
    highlightClass: 'bg-primary',
    iconPaths: [
      {
        d: 'M8.9445 4.58986C7.99777 3.95728 7 3.07697 7 1.93836V0.5C8.38446 0.5 9.73784 0.910543 10.889 1.67971C12.0401 2.44888 12.9373 3.54213 13.4672 4.82121C13.997 6.10028 14.1356 7.50777 13.8655 8.86563C13.5954 10.2235 12.9287 11.4708 11.9497 12.4497C10.9708 13.4287 9.72349 14.0954 8.36563 14.3655C7.00777 14.6356 5.60028 14.497 4.32121 13.9672C3.04213 13.4373 1.94888 12.5401 1.17971 11.389C0.410543 10.2378 0 8.88446 0 7.5H1.43836C2.57697 7.5 3.45728 8.49777 4.08986 9.4445C4.47444 10.0201 5.02107 10.4687 5.66062 10.7336C6.30014 10.9985 7.00389 11.0678 7.68282 10.9327C8.36175 10.7977 8.98538 10.4644 9.47489 9.97489C9.96436 9.48538 10.2977 8.86175 10.4327 8.18282C10.5678 7.50389 10.4985 6.80014 10.2336 6.16062C9.96867 5.52107 9.52007 4.97444 8.9445 4.58986Z',
        class: 'fill-surface-0 dark:fill-surface-900'
      },
      {
        d: 'M3.9375 0.500001C3.69587 0.500001 3.50282 0.696627 3.47269 0.936366C3.43378 1.24606 3.35353 1.54981 3.23358 1.83939C3.05769 2.26403 2.79988 2.64987 2.47487 2.97488C2.14987 3.29988 1.76403 3.55769 1.33939 3.73358C1.04981 3.85353 0.746057 3.93378 0.436365 3.97269C0.196626 4.00282 1.44426e-07 4.19588 1.33864e-07 4.4375L0 7.5C0.919252 7.5 1.8295 7.31895 2.67879 6.96716C3.52807 6.61538 4.29975 6.09976 4.94973 5.44974C5.59975 4.79975 6.11537 4.02807 6.46716 3.17879C6.81894 2.3295 7 1.41925 7 0.5L3.9375 0.500001Z',
        class: 'fill-surface-0 dark:fill-surface-900'
      }
    ]
  }
}))

const trafficSources = computed(() => {
  return [
    {
      id: 'instagram',
      label: 'Instagram',
      value: '660 Visits',
      icon: 'pi pi-instagram',
      bars: [18, 18, 12, 18, 21, 15],
      trend: 'up',
      change: '+8.3%',
      highlightClass: 'bg-primary'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: '733 Visits',
      icon: 'pi pi-linkedin',
      bars: [12, 16, 20, 10, 12, 10],
      trend: 'down',
      change: '-5.2%',
      highlightClass: 'bg-primary'
    },
    {
      id: 'google',
      label: 'Google',
      value: '817 Visits',
      icon: 'pi pi-google',
      bars: [17, 9, 14, 12, 14, 21],
      trend: 'up',
      change: '+12.1%',
      highlightClass: 'bg-primary'
    },
    {
      id: 'x',
      label: 'X',
      value: '995 Visits',
      icon: 'pi pi-twitter',
      bars: [15, 15, 12, 21, 20, 17],
      trend: 'stable',
      change: '0%',
      highlightClass: 'bg-primary'
    }
  ]
})

let statsTimer = null

const triggerStatisticsRefresh = () => {
  trafficLoading.value = true
  if (statsTimer) clearTimeout(statsTimer)
  statsTimer = setTimeout(() => {
    trafficLoading.value = false
  }, 900)
}

onMounted(() => {
  triggerStatisticsRefresh()
})

watch(
  () => [gridConfig.value.currentSize, gridConfig.value.stepKm],
  triggerStatisticsRefresh
)

watch(
  competitors,
  () => triggerStatisticsRefresh(),
  { deep: true }
)

let businessLoadTimer = null
let reportLoadTimer = null

const businessNames = [
  'Dublin House Painters',
  'Pro Paint Solutions',
  'Emerald Painting Services',
  'Premier Decorators Dublin',
  'Colorful Homes Ireland',
  'Expert Paint & Decor',
  'Dublin Interior Design',
  'Quality Painters Ltd',
  'Perfect Finish Painting',
  'Dublin Exterior Experts'
]

const descriptions = [
  'Profesjonalne malowanie mieszkań i biur z gwarancją jakości.',
  'Kompleksowe usługi malarskie i dekoratorskie w całym Dublinie.',
  'Specjaliści od metamorfoz wnętrz, szybkie terminy realizacji.',
  '15 lat doświadczenia w pracy dla firm i klientów indywidualnych.',
  'Kompleksowa obsługa projektów – od wyceny po sprzątanie.',
  'Dostępne ekipy weekendowe, darmowa wycena na miejscu.'
]

const streetNames = [
  'O\'Connell Street',
  'Grafton Street',
  'Dame Street',
  'Parnell Street',
  'Abbey Street',
  'Henry Street',
  'Talbot Street',
  'Capel Street'
]

const handleReportChange = (option) => {
  if (!option || option.code === selectedReport.value?.code) {
    return
  }

  selectedReport.value = option

  triggerStatisticsRefresh()

  if (reportLoadTimer) {
    clearTimeout(reportLoadTimer)
  }

  isLoadingReport.value = true
  isLoadingBusinessData.value = true
  mapRefreshKey.value += 1

  reportLoadTimer = setTimeout(() => {
    isLoadingReport.value = false
  }, 1400)
}

const generateBusinessListings = (ranking) => {
  const listings = []
  const count = 6 + Math.floor(Math.random() * 4)

  for (let i = 0; i < count; i++) {
    const name = businessNames[i % businessNames.length]
    const initials = name.split(' ').map(word => word[0]).slice(0, 2).join('')
    const rating = +(4 + Math.random()).toFixed(1)
    const reviewCount = 80 + Math.floor(Math.random() * 400)
    const streetNum = Math.floor(1 + Math.random() * 200)
    const street = streetNames[Math.floor(Math.random() * streetNames.length)]

    listings.push({
      name,
      initials,
      position: i + 1,
      rating,
      reviewCount,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      address: `${streetNum} ${street}, Dublin`,
      phone: Math.random() > 0.4 ? `+353 ${Math.floor(1 + Math.random() * 9)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}` : null,
      photoUrl: null
    })
  }

  return listings
}

const updateVisibilityMetrics = (ranking) => {
  selectedRanking.value = ranking
  userPosition.value = ranking > 20 ? 20 : ranking

  const normalized = Math.min(Math.max(ranking, 1), 20)
  visibilityPercent.value = Math.max(10, Math.min(100, Math.round((21 - normalized) * 5)))

  if (normalized <= 5) {
    difficulty.value = 'NISKA'
  } else if (normalized <= 10) {
    difficulty.value = 'ŚREDNIA'
  } else if (normalized <= 15) {
    difficulty.value = 'WYSOKA'
  } else {
    difficulty.value = 'BARDZO WYSOKA'
  }
}

const loadBusinessListings = (ranking, delay = 900) => {
  updateVisibilityMetrics(ranking)
  isLoadingBusinessData.value = true
  competitors.value = []
  triggerStatisticsRefresh()

  if (businessLoadTimer) {
    clearTimeout(businessLoadTimer)
  }

  businessLoadTimer = setTimeout(() => {
    competitors.value = generateBusinessListings(ranking)
    isLoadingBusinessData.value = false
  }, delay)
}

const onMarkerSelected = (ranking) => {
  loadBusinessListings(ranking)
}

const onBusinessPanelOpen = (ranking) => {
  selectedRanking.value = ranking
}

const onDateSelected = () => {
  isLoadingBusinessData.value = true
  mapRefreshKey.value += 1
}

const openInGoogle = () => {
  window.open('https://www.google.com/maps', '_blank')
}

const generatePDF = () => {}

const generateCSV = () => {}

const saveSettings = () => {
  activeTab.value = 'map'
  mapRefreshKey.value += 1
}

const handleLocationSearch = (query) => {
  // Mock geocoding - w prawdziwej aplikacji tutaj byłoby zapytanie do API Geocoding
  // Dla celów demo, jeśli użytkownik wpisze "Warszawa", zmieniamy współrzędne
  if (query.toLowerCase().includes('warszawa') || query.toLowerCase().includes('warsaw')) {
    gridConfig.value.centerLat = 52.2297
    gridConfig.value.centerLng = 21.0122
    gridConfig.value.centerName = 'Warszawa, Polska'
  } else if (query.toLowerCase().includes('london')) {
    gridConfig.value.centerLat = 51.5074
    gridConfig.value.centerLng = -0.1278
    gridConfig.value.centerName = 'London, UK'
  } else {
    // Reset to business location if not recognized in mock
    // gridConfig.value.centerLat = location.value.lat
    // gridConfig.value.centerLng = location.value.lng
    // gridConfig.value.centerName = `${location.value.address}, ${location.value.city}`
    
    // Update name anyway to reflect user input
    gridConfig.value.centerName = query
  }
}

const onGridSizeChange = (newSize) => {
  if (gridConfig.value.currentSize !== newSize) {
    gridConfig.value.currentSize = newSize
  }
}

onBeforeUnmount(() => {
  if (businessLoadTimer) clearTimeout(businessLoadTimer)
  if (reportLoadTimer) clearTimeout(reportLoadTimer)
  if (statsTimer) clearTimeout(statsTimer)
})
</script>
