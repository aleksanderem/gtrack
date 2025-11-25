<template>
  <div class="space-y-6">
    <!-- Sekcja Identyfikacji -->
    <Card class="border border-gray-200 !bg-white shadow-none p-2">
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
            class="text-sm font-normal"
            @click="openSearchModal" 
          />
        </div>
      </template>
      <template #content>
        <div class="grid gap-3 md:grid-cols1 mt-4">
          <div class="flex flex-col gap-">
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

    <!-- Sekcja Strony WWW -->
    <BlockUI :blocked="seoLoading">
      <Card class="border border-gray-200 !bg-white shadow-none">
        <template #title>
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <i class="pi pi-globe text-blue-500"></i>
              Strona WWW
            </div>
            <div class="flex gap-2">
              <Button v-if="hasLastAudit" label="Ostatni audyt" icon="pi pi-history" severity="secondary" outlined @click="showLastAudit" size="small" class="text-sm font-normal" />
              <Button label="Skanuj stronę" icon="pi pi-search" severity="help" variant="outlined"  @click="runSeoAudit" :loading="seoLoading" :disabled="!config.website" size="small" class="text-sm font-normal" />
            </div>
          </div>
          <p class="text-sm font-normal text-gray-500 mt-1">
            Adres strony internetowej powiązanej z wizytówką.
          </p>
        </template>
        <template #content>
          <div class="flex flex-col gap-2 mt-4 w-full">
              <label class="text-sm font-medium text-gray-700">Adres URL</label>
              
              <Inplace :closable="true" @close="cancelUrlEdit" @open="startUrlEdit" class="w-full bg-[#f1f5f9] rounded-lg" :pt="{ display: { class: '!p-0 w-full rounded-lg' } }">
                <template #display>
                    <div class="w-full hover:bg-gray-200 cursor-pointer flex justify-between items-center group transition-colors rounded-lg px-3 py-2 w-full">
                        <span v-if="config.website" class="text-blue-700 w-full font-medium text-sm">{{ config.website }}</span>
                        <span v-else class="text-blue-700 italic text-sm">Kliknij, aby dodać adres URL...</span>
                        <small class="text-xs text-gray-500">Ten adres będzie używany w materiałach marketingowych i na landing page'u.</small>
                        <i class="pi pi-pencil text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
                    </div>
                </template>
                <template #content="{ closeCallback }">
                    <div class="flex items-center gap-2 w-full">
                        <InputGroup class="w-full">
                            <InputGroupAddon class="py-2 bg-green-50"><i class="pi pi-lock mr-2 ml-2 text-sm" style="color: green"></i> <span class="mr-2 text-green-500 text-sm">https://</span></InputGroupAddon>
                            <InputText v-model="editingUrl" autofocus class="w-full" @keydown.enter="saveUrlEdit(closeCallback)" />
                        </InputGroup>
                        <div class="flex items-center gap-1 shrink-0">
                            <Button icon="pi pi-check" text rounded class="!text-green-600 hover:!bg-green-50" @click="saveUrlEdit(closeCallback)" />
                            <Button icon="pi pi-times" text rounded class="!text-gray-500 hover:!bg-gray-100" @click="closeCallback" />
                        </div>
                    </div>
                </template>
              </Inplace>

              
          </div>
        </template>
      </Card>
    </BlockUI>

    <!-- Global Loading Overlay -->
    <div v-if="seoLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div class="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
            <div class="text-center">
                <h4 class="font-semibold text-gray-900">Trwa audyt SEO...</h4>
                <p class="text-sm text-gray-500">To może potrwać do minuty. Proszę czekać.</p>
            </div>
        </div>
    </div>

    <!-- SEO Audit Dialog -->
    <Dialog v-model:visible="seoDialogVisible" header="Audyt SEO & Słowa kluczowe" :style="{ width: '80vw' }" modal>
      <div v-if="seoData" class="flex flex-col gap-6">
        <!-- Summary Card -->
        <div class="p-4 bg-surface-50 border border-surface-200 rounded-lg flex items-center justify-between">
          <div>
            <span class="text-sm text-surface-600 block">Audytowana strona</span>
            <a :href="seoData.url.startsWith('http') ? seoData.url : 'https://' + seoData.url" target="_blank" class="text-lg font-bold text-primary hover:underline">{{ seoData.url }}</a>
          </div>
          <div class="flex gap-4">
            <div class="text-center">
              <span class="text-xs text-surface-500 block">Performance</span>
              <Tag :value="seoData.on_page.performance.score + '/100'" :severity="getScoreSeverity(seoData.on_page.performance.score)" />
            </div>
            <div class="text-center">
              <span class="text-xs text-surface-500 block">Problemy</span>
              <Badge :value="seoData.on_page.issues.length" severity="danger" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <!-- On-Site Issues -->
          <Accordion :activeIndex="seoData.on_page.issues.length > 0 ? 0 : null" class="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <AccordionTab>
                <template #header>
                    <div class="flex items-center gap-3 w-full">
                        <span class="text-lg font-semibold text-gray-900">Problemy On-Site</span>
                        <Badge v-if="seoData.on_page.issues.length > 0" :value="seoData.on_page.issues.length" severity="danger" />
                        <Tag v-else severity="success" value="OK" icon="pi pi-check" rounded></Tag>
                    </div>
                </template>
                
                <div v-if="seoData.on_page.issues.length > 0">
                    <DataTable :value="seoData.on_page.issues" size="small" class="text-sm w-full">
                        <Column field="type" header="Typ">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.type" :severity="getIssueSeverity(slotProps.data.type)" />
                        </template>
                        </Column>
                        <Column field="message" header="Problem"></Column>
                    </DataTable>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-4 text-center">
                    <i class="pi pi-check-circle text-3xl text-green-500 mb-2"></i>
                    <span class="font-medium text-gray-900">Brak problemów On-Site!</span>
                    <p class="text-sm text-gray-500">Twoja strona jest dobrze zoptymalizowana.</p>
                </div>
            </AccordionTab>
          </Accordion>

          <!-- Keyword Suggestions -->
          <Card class="border border-gray-200 shadow-sm h-full">
            <template #title><span class="text-lg">Sugerowane Słowa Kluczowe</span></template>
            <template #content>
              <DataTable :value="seoData.keywords" size="small" class="text-sm w-full" paginator :rows="5">
                <Column field="keyword" header="Słowo kluczowe" sortable></Column>
                <Column field="volume" header="Volume" sortable></Column>
                <Column field="difficulty" header="Trudność" sortable>
                  <template #body="slotProps">
                    <span :class="getDifficultyColor(slotProps.data.difficulty)">{{ slotProps.data.difficulty }}/100</span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Meta Tags -->
        <Card class="border border-gray-200 shadow-sm">
          <template #title><span class="text-lg">Meta Tagi</span></template>
          <template #content>
            <div class="flex flex-col gap-3 text-sm">
              <div>
                <span class="font-semibold block">Title ({{ seoData.on_page.meta.title.length }} znaków)</span>
                <p class="text-surface-700 m-0">{{ seoData.on_page.meta.title.value }}</p>
              </div>
              <div>
                <span class="font-semibold block">Description ({{ seoData.on_page.meta.description.length }} znaków)</span>
                <p class="text-surface-700 m-0">{{ seoData.on_page.meta.description.value }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </Dialog>
    
    <!-- Custom Toast for SEO Report -->
    <Toast position="bottom-right" group="seo-report">
        <template #message="slotProps">
            <div class="flex flex-col gap-2 items-start p-1">
                <div class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-500 text-xl"></i>
                    <span class="font-semibold text-gray-900">Audyt zakończony pomyślnie</span>
                </div>
                <p class="text-sm text-gray-600 m-0">Twoja strona została przeanalizowana.</p>
                <Button label="Zobacz raport" size="small" link class="!p-0 !text-blue-600 !font-bold" @click="showLastAudit" />
            </div>
        </template>
    </Toast>

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
            <div class="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div class="flex items-center gap-3">
                    <Avatar icon="pi pi-user" shape="circle" class="bg-green-100 text-green-600 border border-green-200" />
                    <div>
                      <p class="text-xs text-green-500">Zarządzane przez</p>
                      <p class="text-sm font-medium text-green-600">admin@dublinpainters.ie</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-3 w-full sm:w-auto">
                     <Button label="Synchronizuj dane" icon="pi pi-refresh" size="small" severity="success" outlined class="flex-1 sm:flex-none text-sm text-green-600 border-green-200 font-[400]" @click="confirmSync" />
                     <Button label="Rozłącz" icon="pi pi-power-off" size="small" severity="danger" text class="flex-1 sm:flex-none text-sm" @click="confirmDisconnect" />
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
               <div 
                 v-for="card in featureCards" 
                 :key="card.feature.id"
                 :data-feature-key="card.configKey"
                 class="border rounded-xl p-3 bg-white transition-all duration-200 flex flex-col justify-between h-full"
                 :class="[
                   highlightedFeature === card.configKey ? 'ring-2 ring-purple-500 ring-offset-2 shadow-lg' : '',
                   isLocked(card.feature.id) 
                     ? 'border-gray-200 opacity-75 hover:border-gray-300' 
                     : card.feature.id === 'autoReply' ? 'hover:border-blue-300 border-gray-200' :
                       card.feature.id === 'photoMonitoring' ? 'hover:border-purple-300 border-gray-200' :
                       card.feature.id === 'postPublishing' ? 'hover:border-orange-300 border-gray-200' :
                       card.feature.id === 'dataProtection' ? 'hover:border-red-300 border-gray-200' :
                       card.feature.id === 'qaMonitoring' ? 'hover:border-teal-300 border-gray-200' :
                       'hover:border-indigo-300 border-gray-200'
                 ]"
               >
                  <div>
                    <div 
                      class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                      :class="[
                        card.feature.id === 'autoReply' ? 'bg-blue-50 text-blue-600' :
                        card.feature.id === 'photoMonitoring' ? 'bg-purple-50 text-purple-600' :
                        card.feature.id === 'postPublishing' ? 'bg-orange-50 text-orange-600' :
                        card.feature.id === 'dataProtection' ? 'bg-red-50 text-red-600' :
                        card.feature.id === 'qaMonitoring' ? 'bg-teal-50 text-teal-600' :
                        'bg-indigo-50 text-indigo-600'
                      ]"
                    >
                      <i :class="[card.feature.icon, 'text-xl']"></i>
                    </div>
                    <h5 class="font-semibold text-gray-900 text-base mb-2">{{ card.feature.label }}</h5>
                    <p class="text-sm text-gray-500 leading-relaxed mb-4">
                      {{ card.feature.description }}
                    </p>
                    <FeatureLicenseBadge :feature="card.feature" :settings="config" class="mb-4" />
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <InputSwitch 
                      :modelValue="config[card.configKey]" 
                      :disabled="isLocked(card.feature.id)"
                      @update:modelValue="(value) => updateFeature(card.configKey, value)"
                      class="flex-shrink-0" 
                    />
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
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
import Tag from 'primevue/tag'

import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useFeatures } from '../../../composables/useFeatures'
import { useFeatureSettings } from '../../../stores/featureSettings'
import { SeoService } from '../../../services/SeoService'
import FeatureLicenseBadge from './FeatureLicenseBadge.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      placeId: '',
      cid: '',
      website: '',
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
const route = useRoute()
const { isLocked, features } = useFeatures()
const { featureSettings, updateFeature: updateGlobalFeature } = useFeatureSettings()
const highlightedFeature = ref(null)
const seoLoading = ref(false)
const seoDialogVisible = ref(false)
const seoData = ref(null)
const toast = useToast()

const config = computed({
  get: () => {
    // Merge props with global settings - global settings take precedence for feature flags
    const merged = { ...props.modelValue }
    Object.keys(featureSettings.value).forEach(key => {
      if (merged.hasOwnProperty(key)) {
        merged[key] = featureSettings.value[key]
      }
    })
    return merged
  },
  set: (value) => {
    emit('update:modelValue', value)
    // Also update global store for feature flags
    Object.keys(value).forEach(key => {
      if (featureSettings.value.hasOwnProperty(key)) {
        updateGlobalFeature(key, value[key])
      }
    })
  }
})

// Feature cards configuration
const featureCards = [
  { feature: features.autoReply, configKey: 'autoReply' },
  { feature: features.photoMonitoring, configKey: 'photoMonitoring' },
  { feature: features.postPublishing, configKey: 'postPublishing' },
  { feature: features.dataProtection, configKey: 'dataProtection' },
  { feature: features.qaMonitoring, configKey: 'qaMonitoring' },
  { feature: features.hoursSync, configKey: 'hoursSync' }
]

const updateFeature = async (configKey, value) => {
  const feature = featureCards.find(f => f.configKey === configKey)?.feature
  if (feature && isLocked(feature.id)) {
    return // Don't allow toggling locked features
  }
  // Update global store
  await updateGlobalFeature(configKey, value)
  // Update local config
  const newConfig = { ...config.value, [configKey]: value }
  emit('update:modelValue', newConfig)
}

const openWebsite = () => {
  if (config.value.website) {
    let url = config.value.website;
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
}

const runSeoAudit = async () => {
  if (!config.value.website) return;
  
  seoLoading.value = true;
  try {
    const result = await SeoService.runAudit(config.value.website);
    seoData.value = { ...result, url: config.value.website };
    // Don't auto-open dialog, show toast instead
    // seoDialogVisible.value = true; 
    
    toast.add({ 
        severity: 'success', 
        summary: 'Skanowanie zakończone', 
        group: 'seo-report', 
        life: 10000 // Show for 10s
    });
    
    // Refresh last audit check
    checkLastAudit();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się przeskanować strony', life: 3000 });
  } finally {
    seoLoading.value = false;
  }
}

// Convex Integration
import { convex } from '../../../convex';
import { api } from '../../../../convex/_generated/api';
import Inplace from 'primevue/inplace';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const hasLastAudit = ref(false);
const lastAuditLoading = ref(false);
const editingUrl = ref('');

const startUrlEdit = () => {
    // Strip protocol for editing
    let url = config.value.website || '';
    url = url.replace(/^https?:\/\//, '');
    editingUrl.value = url;
}

const cancelUrlEdit = () => {
    editingUrl.value = '';
}

const saveUrlEdit = (closeCallback) => {
    let url = editingUrl.value.trim();
    if (url) {
        // Add protocol if missing (always https for now as per UI)
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        config.value = { ...config.value, website: url };
    }
    if (closeCallback) closeCallback();
}

const checkLastAudit = async (specificUrl = null) => {
    const urlToCheck = specificUrl || config.value.website;
    console.log(`[BusinessSettings] Checking last audit for: ${urlToCheck}`);
    
    if (!urlToCheck) return;
    
    try {
        const org = await convex.query(api.organizations.getCurrent);
        if (org) {
            const audit = await convex.query(api.seo.getAudit, { url: urlToCheck, orgId: org._id });
            console.log(`[BusinessSettings] Audit found:`, audit ? 'Yes' : 'No');
            if (audit) {
                hasLastAudit.value = true;
                seoData.value = { ...audit.fullResult, url: urlToCheck };
            } else {
                hasLastAudit.value = false;
                seoData.value = null;
            }
        }
    } catch (e) {
        console.error("Failed to check last audit", e);
    }
}

const showLastAudit = () => {
    console.log(`[BusinessSettings] Show Last Audit clicked. Data available:`, !!seoData.value);
    if (seoData.value) {
        seoDialogVisible.value = true;
    } else {
        // Retry check if data missing but flag is true (shouldn't happen but safety net)
        checkLastAudit().then(() => {
             if (seoData.value) seoDialogVisible.value = true;
        });
    }
}

// Load initial data
onMounted(async () => {
    try {
        const org = await convex.query(api.organizations.getCurrent);
        if (org && org.website) {
            // Update local config without triggering save
            const newConfig = { ...config.value, website: org.website };
            emit('update:modelValue', newConfig);
            
            // Check for audit using the fetched URL directly to avoid prop update race condition
            checkLastAudit(org.website);
        }
    } catch (e) {
        console.error("Failed to load org data", e);
    }
});

// Save URL on change (Debounced)
let saveTimeout = null;
watch(() => config.value.website, (newUrl) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        if (!newUrl) return;
        try {
             const org = await convex.query(api.organizations.getCurrent);
             if (org) {
                 await convex.mutation(api.organizations.updateWebsiteUrl, { orgId: org._id, url: newUrl });
                 console.log("Website URL saved to Convex");
                 checkLastAudit(); // Check if we have audit for this new URL
             }
        } catch (e) {
            console.error("Failed to save URL", e);
        }
    }, 1000);
});

const getScoreSeverity = (score) => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warn';
  return 'danger';
}

const getIssueSeverity = (type) => {
  if (type === 'error') return 'danger';
  if (type === 'warning') return 'warn';
  return 'info';
}

const getDifficultyColor = (difficulty) => {
  if (difficulty < 30) return 'text-green-600 font-semibold';
  if (difficulty < 60) return 'text-orange-500 font-medium';
  return 'text-red-600 font-bold';
}

// Handle highlight from route query
watch(() => route.query.highlight, (highlight) => {
  if (highlight) {
    highlightedFeature.value = highlight
    // Remove highlight after 3 seconds
    setTimeout(() => {
      highlightedFeature.value = null
    }, 3000)
  }
}, { immediate: true })

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
