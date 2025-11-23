<template>
  <div class="space-y-6">
    <!-- Sekcja Identyfikacji -->
    <Card class="border border-gray-200 !bg-white shadow-none">
      <template #title>
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <i class="pi pi-id-card text-blue-600"></i>
              Identyfikacja Wizytówki
            </div>
            <p class="text-sm font-normal text-gray-500 mt-1">
              Wprowadź identyfikatory ręcznie lub wyszukaj firmę w bazie Google Maps.
            </p>
          </div>
          <Button 
            label="Znajdź wizytówkę" 
            icon="pi pi-search" 
            severity="secondary" 
            outlined 
            @click="openSearchModal" 
          />
        </div>
      </template>
      <template #content>
        <div class="grid gap-6 md:grid-cols-2 mt-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Google Place ID</label>
            <InputGroup>
              <InputText v-model="config.placeId" placeholder="np. ChIJ..." class="w-full" />
              <Button icon="pi pi-copy" severity="secondary" v-tooltip="'Kopiuj'" />
            </InputGroup>
            <small class="text-xs text-gray-500">Unikalny identyfikator miejsca w Google Maps.</small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Google CID (Opcjonalne)</label>
            <InputGroup>
              <InputText v-model="config.cid" placeholder="np. 123456789..." class="w-full" />
              <Button icon="pi pi-copy" severity="secondary" />
            </InputGroup>
            <small class="text-xs text-gray-500">Customer ID używany w starszych linkach map.</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- Sekcja Integracji -->
    <Card class="border border-gray-200 !bg-white shadow-none">
      <template #title>
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <i class="pi pi-google text-red-500"></i>
              Integracja Google Business
            </div>
            <p class="text-sm font-normal text-gray-500 mt-1">
              Zarządzaj danymi wizytówki bezpośrednio z aplikacji.
            </p>
          </div>
          <Badge 
            :value="config.isConnected ? 'Aktywna' : 'Brak połączenia'" 
            :severity="config.isConnected ? 'success' : 'secondary'"
            class="mt-1"
          />
        </div>
      </template>
      
      <template #content>
        <div class="flex flex-col gap-6 pt-0">
          <div v-if="!config.isConnected" class="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
            <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-google text-2xl text-gray-900"></i>
            </div>
            <h4 class="text-gray-900 font-medium mb-2">Połącz z Profilem Firmy w Google</h4>
            <p class="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Uzyskaj dostęp do edycji godzin, odpowiedzi na opinie i statystyk bezpośrednio z API Google.
            </p>
            <Button label="Autoryzuj konto Google" icon="pi pi-google" @click="connectGoogle" />
          </div>

          <div v-else class="flex flex-col gap-4 mt-4">
            <div class="flex flex-col gap-3">
            <!-- Panel Zarządzania (Administrator) -->
            <div class="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div class="flex items-center gap-3">
                    <Avatar icon="pi pi-user" shape="circle" class="bg-gray-100 text-gray-600 border border-gray-200" />
                    <div>
                      <p class="text-xs text-gray-500">Zarządzane przez</p>
                      <p class="text-sm font-medium text-gray-900">admin@dublinpainters.ie</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-3 w-full sm:w-auto">
                     <Button label="Synchronizuj dane" icon="pi pi-refresh" size="small" severity="secondary" outlined class="flex-1 sm:flex-none" @click="confirmSync" />
                     <Button label="Rozłącz" icon="pi pi-power-off" size="small" severity="danger" text class="flex-1 sm:flex-none" @click="confirmDisconnect" />
                 </div>
            </div>

            <!-- Karta Wizytówki GMB -->
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <!-- Sekcja: Zdjęcie i Info -->
              <div class="p-6">
                <!-- Header: Image + Main Info -->
                <div class="flex gap-5 mb-6">
                  <div class="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                    <img src="https://placehold.co/200" alt="Business Logo" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <!-- Status moved above Name -->
                    <div class="mb-2">
                      <span class="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">Otwarte teraz</span>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="text-xl font-bold text-gray-900 truncate">{{ businessProfile.name }}</h4>
                      <i class="pi pi-check-circle text-blue-500" v-tooltip="'Profil zweryfikowany'"></i>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">{{ businessProfile.category }} • {{ businessProfile.address }}</p>
                    
                    <!-- Ratings without wrapping -->
                    <div class="flex items-center gap-4 text-sm whitespace-nowrap">
                      <div class="flex items-center gap-1">
                        <span class="font-bold text-gray-900">{{ businessProfile.rating }}</span>
                        <div class="flex text-yellow-400 text-xs">
                          <i v-for="n in 5" :key="n" class="pi pi-star-fill"></i>
                        </div>
                        <span class="text-gray-500">({{ businessProfile.reviewCount }} opinie)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tabs for Details -->
                <div class="mt-6 pt-2 business-tabs">
                  <Tabs value="0">
                    <TabList class="!border-b !border-gray-100 mb-4">
                        <Tab value="0" class="!text-sm !py-3 !px-4 !font-medium !text-gray-600 data-[p-active=true]:!text-blue-600 data-[p-active=true]:!border-blue-600">Informacje</Tab>
                        <Tab value="1" class="!text-sm !py-3 !px-4 !font-medium !text-gray-600 data-[p-active=true]:!text-blue-600 data-[p-active=true]:!border-blue-600">Godziny otwarcia</Tab>
                        <Tab value="2" class="!text-sm !py-3 !px-4 !font-medium !text-gray-600 data-[p-active=true]:!text-blue-600 data-[p-active=true]:!border-blue-600">Udogodnienia</Tab>
                    </TabList>
                    <TabPanels class="!p-0">
                        <!-- Tab 1: Informacje -->
                        <TabPanel value="0">
                            <DataTable :value="infoTableData" size="small" :showHeaders="false" class="text-sm">
                                <Column style="width: 2rem">
                                    <template #body="slotProps">
                                        <i :class="slotProps.data.icon" class="text-gray-400"></i>
                                    </template>
                                </Column>
                                <Column>
                                    <template #body="slotProps">
                                        <div class="flex flex-col">
                                            <span class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{{ slotProps.data.label }}</span>
                                            <a v-if="slotProps.data.isLink" :href="slotProps.data.linkUrl" target="_blank" class="text-blue-600 hover:underline font-medium">
                                                {{ slotProps.data.value }}
                                            </a>
                                            <span v-else class="font-medium text-gray-900">{{ slotProps.data.value }}</span>
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>

                        <!-- Tab 2: Godziny -->
                        <TabPanel value="1">
                             <div class="space-y-2 text-sm text-gray-600 pt-2">
                                <div v-for="day in businessProfile.openingHours" :key="day.day" class="flex justify-between py-1 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                                    <span>{{ day.day }}</span>
                                    <span class="font-medium" :class="{'text-green-600': day.hours !== 'Zamknięte', 'text-gray-400': day.hours === 'Zamknięte'}">{{ day.hours }}</span>
                                </div>
                             </div>
                        </TabPanel>

                        <!-- Tab 3: Udogodnienia -->
                        <TabPanel value="2">
                            <div class="pt-2">
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="attr in businessProfile.attributes" :key="attr" class="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700 flex items-center gap-2">
                                      <i class="pi pi-check text-green-500 text-xs"></i>
                                      {{ attr }}
                                    </span>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>
              </div>
            </div>
            </div>

            <div class="grid gap-[1.5rem] md:grid-cols-2 lg:grid-cols-3 mx-0">
               <!-- Automation Cards -->
               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-blue-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 flex-shrink-0">
                      <i class="pi pi-comments text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Auto-odpowiedzi</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      System automatycznie wygeneruje i opublikuje podziękowania za pozytywne opinie (5★).
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.autoReply" class="flex-shrink-0" />
                  </div>
               </div>

               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-purple-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 flex-shrink-0">
                       <i class="pi pi-images text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Monitoring zdjęć</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      Powiadamiaj o nowych zdjęciach dodanych przez klientów i archiwizuj je.
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.syncPhotos" class="flex-shrink-0" />
                  </div>
               </div>

               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-orange-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 flex-shrink-0">
                       <i class="pi pi-calendar text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Publikacja postów</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      Włącz moduł planowania wpisów (Oferty, Wydarzenia) na profilu firmy.
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.autoPost" class="flex-shrink-0" />
                  </div>
               </div>

               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-red-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 flex-shrink-0">
                       <i class="pi pi-shield text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Ochrona danych</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      Blokuj nieautoryzowane zmiany w wizytówce (np. godziny, telefon) sugerowane przez użytkowników.
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.protectData" class="flex-shrink-0" />
                  </div>
               </div>

               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-teal-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 flex-shrink-0">
                       <i class="pi pi-question-circle text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Monitoring Q&A</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      Powiadamiaj o nowych pytaniach od klientów i sugeruj odpowiedzi AI.
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.monitorQA" class="flex-shrink-0" />
                  </div>
               </div>

               <div class="border border-gray-200 rounded-xl p-3 bg-white hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 flex-shrink-0">
                       <i class="pi pi-clock text-xl"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">Godziny otwarcia</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      Automatycznie aktualizuj godziny w dni świąteczne i wolne od pracy.
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch v-model="config.syncHours" class="flex-shrink-0" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <ConfirmDialog />
    <!-- Search Modal -->
    <Dialog v-model:visible="searchModalVisible" modal header="Wyszukaj wizytówkę w Google" :style="{ width: '500px' }">
      <div class="flex flex-col gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Nazwa firmy lub adres..." class="w-full" autofocus @input="simulateSearch" />
        </IconField>
        
        <div v-if="searchResults.length > 0" class="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-2 max-h-60 overflow-y-auto">
           <div 
            v-for="result in searchResults" 
            :key="result.place_id"
            class="p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors"
            @click="selectPlace(result)"
           >
             <i class="pi pi-map-marker text-gray-400 mt-1"></i>
             <div>
               <p class="text-sm font-medium text-gray-900">{{ result.name }}</p>
               <p class="text-xs text-gray-500">{{ result.formatted_address }}</p>
             </div>
           </div>
        </div>
        <div v-else-if="searchQuery.length > 2" class="text-center py-4 text-gray-500 text-sm">
           Szukam...
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import InputSwitch from 'primevue/inputswitch'
import Card from 'primevue/card'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      placeId: '',
      cid: '',
      isConnected: false,
      autoReply: false,
      syncPhotos: true,
      autoPost: false,
      protectData: true,
      monitorQA: false,
      syncHours: false
    })
  }
})

const emit = defineEmits(['update:modelValue'])
const confirm = useConfirm()

const config = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Search Logic
const searchModalVisible = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
let searchTimeout = null

const openSearchModal = () => {
  searchModalVisible.value = true
  searchQuery.value = ''
  searchResults.value = []
}

const simulateSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchResults.value = []
  
  if (searchQuery.value.length < 3) return

  searchTimeout = setTimeout(() => {
    // Mock data
    searchResults.value = [
      {
        name: 'Dublin House Painters',
        formatted_address: '123 O\'Connell Street, Dublin, Ireland',
        place_id: 'ChIJ_wd72GqZZ0gR32_123456',
        cid: '123456789101112'
      },
      {
        name: 'Dublin Painters & Decorators',
        formatted_address: '45 Grafton Street, Dublin 2',
        place_id: 'ChIJ_another_id_789',
        cid: '9876543210'
      }
    ]
  }, 600)
}

const selectPlace = (place) => {
  const newConfig = { 
    ...config.value, 
    placeId: place.place_id,
    cid: place.cid
  }
  emit('update:modelValue', newConfig)
  searchModalVisible.value = false
}

const connectGoogle = () => {
  // Mock connection flow
  const newConfig = { ...config.value, isConnected: true }
  emit('update:modelValue', newConfig)
}

const confirmSync = () => {
  confirm.require({
    message: 'Czy na pewno chcesz zsynchronizować dane z Google Business? Może to nadpisać lokalne zmiany.',
    header: 'Potwierdź synchronizację',
    icon: 'pi pi-refresh',
    acceptLabel: 'Tak, synchronizuj',
    rejectLabel: 'Anuluj',
    accept: () => {
      // Mock sync
      console.log('Synchronizacja zakończona')
    }
  })
}

const confirmDisconnect = () => {
  confirm.require({
    message: 'Czy na pewno chcesz rozłączyć konto Google? Utracisz dostęp do funkcji automatyzacji.',
    header: 'Potwierdź rozłączenie',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Tak, rozłącz',
    rejectLabel: 'Anuluj',
    acceptClass: 'p-button-danger',
    accept: () => {
      config.value = { ...config.value, isConnected: false }
    }
  })
}

const businessProfile = ref({
  name: 'Dublin House Painters',
  category: 'Usługi malarskie',
  address: '123 O\'Connell Street, Dublin, Ireland',
  rating: 4.8,
  reviewCount: 124,
  phone: '+353 1 234 5678',
  website: 'https://dublinpainters.ie',
  googleMapsLink: 'https://maps.google.com',
  serviceArea: 'Dublin i okolice (do 50km)',
  attributes: ['Dostępne dla wózków', 'Parking', 'Wi-Fi dla klientów', 'Płatność kartą'],
  openingHours: [
    { day: 'Poniedziałek', hours: '08:00 - 18:00' },
    { day: 'Wtorek', hours: '08:00 - 18:00' },
    { day: 'Środa', hours: '08:00 - 18:00' },
    { day: 'Czwartek', hours: '08:00 - 18:00' },
    { day: 'Piątek', hours: '08:00 - 17:00' },
    { day: 'Sobota', hours: '09:00 - 14:00' },
    { day: 'Niedziela', hours: 'Zamknięte' }
  ]
})

const infoTableData = computed(() => [
  { icon: 'pi pi-phone', label: 'Telefon', value: businessProfile.value.phone, isLink: false },
  { icon: 'pi pi-globe', label: 'Strona www', value: businessProfile.value.website, isLink: true, linkUrl: businessProfile.value.website },
  { icon: 'pi pi-map', label: 'Obszar usługowy', value: businessProfile.value.serviceArea, isLink: false },
  { icon: 'pi pi-google', label: 'Mapy Google', value: 'Zobacz w Google Maps', isLink: true, linkUrl: businessProfile.value.googleMapsLink }
])
</script>
