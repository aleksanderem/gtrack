<template>
  <div class="gtrack-app h-screen flex relative lg:static bg-gray-100 overflow-hidden">
    <!-- Far Left Navigation Sidebar (70px) -->
    <FarLeftNavbar />

    <!-- Left Sidebar (320px) -->
    <LeftSidebar
      :location="location"
      :keywords="keywords"
      :editMode="editMode"
      :sidebarView="sidebarView"
      @update:sidebarView="sidebarView = $event"
      @update:keywords="keywords = $event"
      @toggle-edit="editMode = !editMode"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar (Keyword Dropdown + View Tabs + Generuj Button) -->
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

      <!-- Horizontal Calendar -->
      <HorizontalCalendar @date-selected="onDateSelected" />

      <!-- Main Content Area (right side) -->
      <div class="flex-1 flex flex-col overflow-hidden" style="position: relative;">
        <!-- Map Container - flex row with panel and map side by side -->
        <div v-if="activeTab === 'map'" class="p-4 flex gap-3 flex-1 overflow-hidden">
          <!-- Business Listings Panel (left side, fixed width) -->
          <BusinessPanel
            :userPosition="userPosition"
            :visibilityPercent="visibilityPercent"
            :difficulty="difficulty"
            :keywordsCount="keywords.length"
            :competitors="competitors"
            :isLoading="isLoadingBusinessData"
            @open-in-google="openInGoogle"
          />

          <!-- Map (right side, takes rest of space) -->
          <div class="bg-white rounded p-3 flex-1" style="height: 100%; border: 1px solid #e5e7eb;">
            <GoogleMapView
              :gridConfig="gridConfig"
              :refreshKey="mapRefreshKey"
              @marker-selected="onMarkerSelected"
              @business-panel-open="onBusinessPanelOpen"
              @grid-size-change="onGridSizeChange"
            />
          </div>
        </div>

        <!-- Settings Container -->
        <div v-else-if="activeTab === 'settings'" class="flex-1 overflow-auto">
          <!-- Settings Header -->
          <div class="bg-white border-b border-gray-200">
            <div class="mx-auto" style="max-width: 1200px; padding: 1.5rem 2rem;">
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-gray-900 font-semibold m-0 mb-2" style="font-size: 1.5rem;">
                    Ustawienia
                  </h1>
                  <div class="flex items-center text-gray-600 gap-3 text-sm">
                    <span class="flex items-center gap-2">
                      <i class="pi pi-th-large"></i>
                      Siatka: {{ gridConfig.currentSize }}x{{ gridConfig.currentSize }}
                    </span>
                    <span class="flex items-center gap-2">
                      <i class="pi pi-arrows-h"></i>
                      Odstęp: {{ gridConfig.stepKm * 1000 }}m
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    label="Anuluj"
                    severity="secondary"
                    outlined
                    @click="activeTab = 'map'"
                  />
                  <Button
                    label="Zapisz ustawienia"
                    icon="pi pi-check"
                    @click="saveSettings"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Content -->
          <div class="mx-auto" style="max-width: 1200px; padding: 2rem;">
            <div class="grid grid-cols-12 gap-6">
              <aside class="col-span-12 lg:col-span-4 xl:col-span-3">
                <SettingsNavigation
                  v-model="settingsTab"
                  :items="settingsNavItems"
                  title="Ustawienia"
                />
              </aside>

              <section class="col-span-12 lg:col-span-8 xl:col-span-9">
                <div v-if="settingsTab === 'scanning'" class="space-y-6">
                  <GridConfiguration
                    v-model:gridSize="gridConfig.currentSize"
                    v-model:stepKm="gridConfig.stepKm"
                  />
                </div>
                <div v-else-if="settingsTab === 'frequency'">
                  <FrequencySettings />
                </div>
                <div v-else-if="settingsTab === 'notifications'">
                  <NotificationSettings />
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- Placeholder for other tabs (Comparison, Analysis) -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <i class="pi pi-inbox text-6xl text-gray-400 mb-4"></i>
            <h2 class="text-2xl text-gray-600">{{ activeTab.toUpperCase() }} View</h2>
            <p class="text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import FarLeftNavbar from './components/gtrack/FarLeftNavbar.vue'
import LeftSidebar from './components/gtrack/LeftSidebar.vue'
import TopBar from './components/gtrack/TopBar.vue'
import HorizontalCalendar from './components/gtrack/HorizontalCalendar.vue'
import BusinessPanel from './components/gtrack/BusinessPanel.vue'
import GoogleMapView from './components/gtrack/map/GoogleMapView.vue'
import GridConfiguration from './components/gtrack/sidebar/GridConfiguration.vue'
import FrequencySettings from './components/gtrack/settings/FrequencySettings.vue'
import NotificationSettings from './components/gtrack/settings/NotificationSettings.vue'
import Button from 'primevue/button'

// Location data
const location = ref({
  name: 'Dublin City Center',
  address: '123 O\'Connell Street',
  city: 'Dublin',
  postal: 'D01 F5P2',
  phone: '+353 1 234 5678',
  status: 'Active'
})

// Keywords
const keywords = ref([
  'restaurant dublin',
  'best food dublin',
  'italian restaurant'
])

// Grid configuration
const gridConfig = ref({
  currentSize: 9,
  stepKm: 1,
  centerLat: 53.3498,
  centerLng: -6.2603
})

// Report options for TopBar
const reportOptions = ref([
  { code: 'keyword1', name: 'restaurant dublin' },
  { code: 'keyword2', name: 'best food dublin' },
  { code: 'keyword3', name: 'italian restaurant' }
])

const selectedReport = ref(reportOptions.value[0])
const isLoadingReport = ref(false)

// Business Panel data
const userPosition = ref(9)
const visibilityPercent = ref(60)
const difficulty = ref('ŚREDNIA')
const isLoadingBusinessData = ref(false)

const competitors = ref([])

// UI state
const editMode = ref(false)
const sidebarView = ref('info') // 'info' or 'settings'
const activeTab = ref('map') // 'map', 'comparison', 'analysis', 'settings'
const mapRefreshKey = ref(0)
const selectedRanking = ref(null)
const settingsTab = ref('scanning')

const settingsNavItems = [
  {
    id: 'scanning',
    label: 'Ustawienia skanowania',
    description: 'Siatka, odstępy i punkt centralny',
    icon: 'pi pi-th-large'
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
  const count = 6 + Math.floor(Math.random() * 4) // 6-9 listings

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

const onDateSelected = (date) => {
  console.log('Date selected:', date)
  isLoadingBusinessData.value = true
  mapRefreshKey.value += 1
}

const openInGoogle = () => {
  console.log('Opening in Google')
  window.open('https://www.google.com/maps', '_blank')
}

const generatePDF = () => {
  console.log('Generating PDF report')
}

const generateCSV = () => {
  console.log('Generating CSV report')
}

const saveSettings = () => {
  console.log('Saving settings:', gridConfig.value)
  activeTab.value = 'map'
  mapRefreshKey.value += 1
}

const onGridSizeChange = (newSize) => {
  if (gridConfig.value.currentSize !== newSize) {
    gridConfig.value.currentSize = newSize
  }
}

onBeforeUnmount(() => {
  if (businessLoadTimer) {
    clearTimeout(businessLoadTimer)
  }
  if (reportLoadTimer) {
    clearTimeout(reportLoadTimer)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: var(--surface-ground);
}

.gtrack-app {
  width: 100vw;
  height: 100vh;
}
</style>
