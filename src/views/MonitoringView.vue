<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">Monitoring & Protection</h1>
            <Tag v-if="openIncidents > 0" :value="`${openIncidents} otwartych`" severity="danger" />
          </div>
          <p class="text-sm text-gray-500 mt-1">Wykrywanie i reagowanie na zmiany w wizytówce</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Auto-revert button - gated by monitoringAutoRevert (Enterprise) -->
          <Button
            v-if="can('monitoringAutoRevert')"
            label="Auto-przywracanie"
            icon="pi pi-undo"
            severity="secondary"
            outlined
            @click="openAutoRevertSettings"
          />
          <Button
            v-else
            label="Auto-przywracanie"
            icon="pi pi-lock"
            severity="secondary"
            outlined
            disabled
            v-tooltip.bottom="'Dostępne w planie Enterprise'"
          />
          <Button
            label="Eksportuj raport"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="exportReport"
          />
        </div>
      </div>

      <!-- Limit Warning Banner -->
      <LimitWarningBanner
        v-if="incidentsLimitStatus && incidentsLimitStatus.percentage >= 75"
        :status="incidentsLimitStatus"
        @upgrade="navigateToSettings"
      />

      <!-- Statistics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card v-for="stat in statsCards" :key="stat.key" class="border-0 shadow-sm">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
                <p v-if="stat.subtext" class="text-xs text-gray-400 mt-1">{{ stat.subtext }}</p>
              </div>
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="stat.bgColor"
              >
                <i :class="['pi', stat.icon, stat.iconColor]" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Premium Features Info -->
      <div v-if="!can('monitoringChangeHistory') || !can('monitoringAutoRevert')"
           class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-shield text-blue-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-1">Pełna ochrona wizytówki</h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p v-if="!can('monitoringChangeHistory')">
                <i class="pi pi-history mr-1" /><strong>Historia zmian</strong> (Professional) - Pełna historia do {{ historyRetentionDays }} dni wstecz
              </p>
              <p v-if="!can('monitoringAutoRevert')">
                <i class="pi pi-undo mr-1" /><strong>Auto-przywracanie</strong> (Enterprise) - Automatyczne cofanie nieautoryzowanych zmian
              </p>
            </div>
            <Button
              label="Zwiększ pakiet"
              icon="pi pi-arrow-right"
              size="small"
              class="mt-3"
              @click="navigateToSettings"
            />
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <TabView v-model:activeIndex="activeTabIndex">
        <!-- Incidents Tab -->
        <TabPanel header="Incydenty">
          <!-- Filters -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <div class="flex flex-wrap items-center gap-3">
              <Select
                v-model="incidentTypeFilter"
                :options="incidentTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Typ incydentu"
                class="w-44"
              />
              <Select
                v-model="incidentStatusFilter"
                :options="incidentStatusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Status"
                class="w-40"
              />
              <DatePicker
                v-model="dateRange"
                selectionMode="range"
                placeholder="Zakres dat"
                class="w-56"
                dateFormat="dd/mm/yy"
                showIcon
              />
              <Button
                icon="pi pi-filter-slash"
                severity="secondary"
                text
                @click="clearFilters"
                v-tooltip="'Wyczyść filtry'"
              />
            </div>
          </div>

          <!-- Bulk Actions -->
          <Transition name="fade">
            <div
              v-if="selectedIncidents.length > 0"
              class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between mb-4"
            >
              <span class="text-sm font-medium text-blue-800">
                {{ selectedIncidents.length }} zaznaczonych
              </span>
              <div class="flex items-center gap-2">
                <Button
                  label="Rozwiąż"
                  icon="pi pi-check"
                  severity="success"
                  size="small"
                  @click="bulkResolve"
                />
                <Button
                  v-if="can('monitoringAutoRevert')"
                  label="Przywróć wszystkie"
                  icon="pi pi-undo"
                  severity="info"
                  size="small"
                  @click="bulkRevert"
                />
                <Button
                  label="Ignoruj"
                  icon="pi pi-times"
                  severity="secondary"
                  size="small"
                  @click="bulkIgnore"
                />
              </div>
            </div>
          </Transition>

          <!-- Incidents Table -->
          <Card class="border-0 shadow-sm">
            <template #content>
              <DataTable
                v-model:selection="selectedIncidents"
                :value="filteredIncidents"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50]"
                dataKey="id"
                :loading="isLoading"
                stripedRows
                rowHover
                @row-click="(e) => openIncidentDrawer(e.data)"
                class="cursor-pointer"
              >
                <Column selectionMode="multiple" headerStyle="width: 3rem" />

                <Column field="createdAt" header="Data" sortable style="width: 140px">
                  <template #body="{ data }">
                    <span class="text-sm">{{ formatDate(data.createdAt) }}</span>
                  </template>
                </Column>

                <Column field="type" header="Typ" sortable style="width: 150px">
                  <template #body="{ data }">
                    <Tag :value="getTypeLabel(data.type)" :severity="getTypeSeverity(data.type)" />
                  </template>
                </Column>

                <Column field="description" header="Opis" style="min-width: 250px">
                  <template #body="{ data }">
                    <p class="text-sm text-gray-700 line-clamp-2">{{ data.description }}</p>
                  </template>
                </Column>

                <Column field="status" header="Status" sortable style="width: 130px">
                  <template #body="{ data }">
                    <div class="flex items-center gap-1">
                      <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
                      <Tag
                        v-if="data.autoReverted && can('monitoringAutoRevert')"
                        severity="info"
                        class="text-xs"
                      >
                        <template #value>
                          <div class="flex items-center gap-1">
                            <i class="pi pi-undo text-xs" />
                            <span>Auto</span>
                          </div>
                        </template>
                      </Tag>
                    </div>
                  </template>
                </Column>

                <Column header="Akcje" style="width: 140px">
                  <template #body="{ data }">
                    <div class="flex items-center gap-1">
                      <Button
                        icon="pi pi-eye"
                        severity="secondary"
                        text
                        size="small"
                        @click.stop="openIncidentDrawer(data)"
                        v-tooltip="'Szczegóły'"
                      />
                      <Button
                        v-if="data.status !== 'RESOLVED'"
                        icon="pi pi-check"
                        severity="success"
                        text
                        size="small"
                        @click.stop="resolveIncident(data)"
                        v-tooltip="'Rozwiąż'"
                      />
                      <Button
                        v-if="data.oldValue && data.status !== 'RESOLVED'"
                        icon="pi pi-undo"
                        :severity="can('monitoringAutoRevert') ? 'info' : 'secondary'"
                        :text="true"
                        size="small"
                        :disabled="!can('monitoringAutoRevert')"
                        @click.stop="revertIncident(data)"
                        v-tooltip="can('monitoringAutoRevert') ? 'Przywróć' : 'Przywracanie dostępne w planie Enterprise'"
                      />
                      <Button
                        v-if="data.status !== 'IGNORED'"
                        icon="pi pi-times"
                        severity="secondary"
                        text
                        size="small"
                        @click.stop="ignoreIncident(data)"
                        v-tooltip="'Ignoruj'"
                      />
                    </div>
                  </template>
                </Column>

                <template #empty>
                  <div class="text-center py-12">
                    <i class="pi pi-shield text-4xl text-green-300 mb-3" />
                    <p class="text-gray-500">Brak nowych incydentów</p>
                    <p class="text-sm text-gray-400 mt-1">Wszystko wygląda dobrze!</p>
                  </div>
                </template>
              </DataTable>
            </template>
          </Card>
        </TabPanel>

        <!-- Change History Tab - gated by monitoringChangeHistory -->
        <TabPanel>
          <template #header>
            <div class="flex items-center gap-2">
              <span>Historia zmian</span>
              <i v-if="!can('monitoringChangeHistory')" class="pi pi-lock text-xs text-gray-400" />
            </div>
          </template>

          <!-- Feature locked overlay -->
          <div v-if="!can('monitoringChangeHistory')" class="relative">
            <div class="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center min-h-[300px]">
              <div class="text-center p-8 max-w-md">
                <i class="pi pi-lock text-4xl text-gray-400 mb-4" />
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Historia zmian</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Pełna historia zmian profilu jest dostępna w planie Professional.
                  Aktualnie przechowujesz historię tylko przez {{ historyRetentionDays }} dni.
                </p>
                <Button
                  label="Zwiększ pakiet"
                  icon="pi pi-arrow-right"
                  size="small"
                  @click="navigateToSettings"
                />
              </div>
            </div>
            <!-- Blurred preview -->
            <div class="blur-sm pointer-events-none">
              <DataTable :value="changeHistory.slice(0, 3)" dataKey="id" stripedRows>
                <Column field="timestamp" header="Data" style="width: 150px" />
                <Column field="field" header="Pole" style="width: 130px" />
                <Column field="oldValue" header="Stara wartość" style="width: 200px" />
                <Column field="newValue" header="Nowa wartość" style="width: 200px" />
              </DataTable>
            </div>
          </div>

          <!-- Full access content -->
          <div v-else>
            <div class="flex items-center justify-between mb-4">
              <div class="text-sm text-gray-500">
                <i class="pi pi-info-circle mr-1" />
                Historia przechowywana przez <strong>{{ historyRetentionDays }}</strong> dni
              </div>
              <Button
                label="Eksportuj historię"
                icon="pi pi-download"
                severity="secondary"
                size="small"
                @click="exportHistory"
              />
            </div>

            <Card class="border-0 shadow-sm">
              <template #content>
                <DataTable
                  :value="changeHistory"
                  :paginator="true"
                  :rows="10"
                  dataKey="id"
                  stripedRows
                  rowHover
                >
                  <Column field="timestamp" header="Data" sortable style="width: 150px">
                    <template #body="{ data }">
                      <span class="text-sm">{{ formatDateTime(data.timestamp) }}</span>
                    </template>
                  </Column>

                  <Column field="field" header="Pole" sortable style="width: 130px">
                    <template #body="{ data }">
                      <Tag :value="data.field" severity="info" />
                    </template>
                  </Column>

                  <Column field="oldValue" header="Stara wartość" style="width: 200px">
                    <template #body="{ data }">
                      <span class="text-sm text-red-600 line-through">{{ data.oldValue || '—' }}</span>
                    </template>
                  </Column>

                  <Column field="newValue" header="Nowa wartość" style="width: 200px">
                    <template #body="{ data }">
                      <span class="text-sm text-green-600">{{ data.newValue || '—' }}</span>
                    </template>
                  </Column>

                  <Column field="changedBy" header="Źródło" sortable style="width: 130px">
                    <template #body="{ data }">
                      <Tag
                        :value="getChangedByLabel(data.changedBy)"
                        :severity="data.changedBy === 'USER' ? 'success' : data.changedBy === 'GOOGLE_UPDATE' ? 'warn' : 'secondary'"
                      />
                    </template>
                  </Column>

                  <Column field="authorized" header="Status" style="width: 120px">
                    <template #body="{ data }">
                      <Tag
                        :value="data.authorized ? 'Autoryzowana' : 'Nieznana'"
                        :severity="data.authorized ? 'success' : 'danger'"
                      />
                    </template>
                  </Column>

                  <Column header="Akcje" style="width: 80px">
                    <template #body="{ data }">
                      <Button
                        v-if="!data.authorized && can('monitoringAutoRevert')"
                        icon="pi pi-replay"
                        severity="info"
                        text
                        size="small"
                        @click="restoreValue(data)"
                        v-tooltip="'Przywróć'"
                      />
                      <Button
                        v-else-if="!data.authorized"
                        icon="pi pi-replay"
                        severity="secondary"
                        text
                        size="small"
                        disabled
                        v-tooltip="'Przywracanie dostępne w Enterprise'"
                      />
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>
        </TabPanel>

        <!-- Removed Reviews Tab -->
        <TabPanel header="Usunięte opinie">
          <div class="flex justify-end mb-4">
            <Button
              label="Eksportuj CSV"
              icon="pi pi-download"
              severity="secondary"
              size="small"
              @click="exportRemovedReviews"
            />
          </div>

          <Card class="border-0 shadow-sm">
            <template #content>
              <DataTable
                :value="removedReviews"
                :paginator="true"
                :rows="10"
                dataKey="reviewId"
                stripedRows
                rowHover
              >
                <Column field="removedAt" header="Usunięto" sortable style="width: 140px">
                  <template #body="{ data }">
                    <span class="text-sm">{{ formatDate(data.removedAt) }}</span>
                  </template>
                </Column>

                <Column field="author" header="Autor" style="width: 150px">
                  <template #body="{ data }">
                    <span class="font-medium">{{ data.author }}</span>
                  </template>
                </Column>

                <Column field="rating" header="Ocena" sortable style="width: 130px">
                  <template #body="{ data }">
                    <Rating :modelValue="data.rating" readonly :cancel="false" />
                  </template>
                </Column>

                <Column field="oldContent" header="Treść" style="min-width: 250px">
                  <template #body="{ data }">
                    <p class="text-sm text-gray-700 line-clamp-2">{{ data.oldContent }}</p>
                  </template>
                </Column>

                <Column field="createdAt" header="Dodano" sortable style="width: 130px">
                  <template #body="{ data }">
                    <span class="text-sm text-gray-500">{{ formatDate(data.createdAt) }}</span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </TabPanel>
      </TabView>
    </div>

    <!-- Incident Detail Drawer -->
    <Drawer
      v-model:visible="showIncidentDrawer"
      position="right"
      :style="{ width: '550px' }"
      header="Szczegóły incydentu"
    >
      <div v-if="selectedIncident" class="space-y-6">
        <!-- Incident Header -->
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="getTypeBgColor(selectedIncident.type)"
          >
            <i :class="['pi', getTypeIcon(selectedIncident.type), 'text-white text-xl']" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <Tag :value="getTypeLabel(selectedIncident.type)" :severity="getTypeSeverity(selectedIncident.type)" />
              <Tag
                v-if="selectedIncident.autoReverted && can('monitoringAutoRevert')"
                severity="info"
              >
                <template #value>
                  <div class="flex items-center gap-1">
                    <i class="pi pi-undo text-xs" />
                    <span>Auto-przywrócone</span>
                  </div>
                </template>
              </Tag>
            </div>
            <p class="text-sm text-gray-500">{{ formatDateTime(selectedIncident.createdAt) }}</p>
          </div>
          <Tag :value="getStatusLabel(selectedIncident.status)" :severity="getStatusSeverity(selectedIncident.status)" />
        </div>

        <!-- Description -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Opis</h4>
          <p class="text-gray-700 leading-relaxed">{{ selectedIncident.description }}</p>
        </div>

        <!-- Changed Values -->
        <div v-if="selectedIncident.field" class="space-y-3">
          <h4 class="font-semibold text-gray-900">Zmienione dane</h4>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Pole</span>
              <span class="font-medium">{{ selectedIncident.field }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Poprzednia wartość</span>
              <span class="text-red-600 line-through">{{ selectedIncident.oldValue || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Nowa wartość</span>
              <span class="text-green-600">{{ selectedIncident.newValue || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Evidence -->
        <div v-if="selectedIncident.evidence" class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-semibold text-yellow-900 mb-2">Dodatkowe informacje</h4>
          <pre class="text-sm text-yellow-800 whitespace-pre-wrap">{{ JSON.stringify(selectedIncident.evidence, null, 2) }}</pre>
        </div>

        <!-- Auto-revert info -->
        <div v-if="!can('monitoringAutoRevert') && selectedIncident.oldValue" class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5" />
            <div>
              <h4 class="font-semibold text-blue-900 mb-1">Auto-przywracanie</h4>
              <p class="text-sm text-blue-800">
                W planie Enterprise możesz włączyć automatyczne przywracanie nieautoryzowanych zmian.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t">
          <Button
            v-if="selectedIncident.status !== 'RESOLVED'"
            label="Rozwiąż"
            icon="pi pi-check"
            severity="success"
            class="flex-1"
            @click="resolveIncident(selectedIncident)"
          />
          <Button
            v-if="selectedIncident.field && selectedIncident.oldValue"
            label="Przywróć"
            icon="pi pi-replay"
            :severity="can('monitoringAutoRevert') ? 'info' : 'secondary'"
            class="flex-1"
            :disabled="!can('monitoringAutoRevert')"
            @click="restoreIncident(selectedIncident)"
          />
          <Button
            v-if="selectedIncident.status !== 'IGNORED'"
            label="Ignoruj"
            icon="pi pi-times"
            severity="secondary"
            @click="ignoreIncident(selectedIncident)"
          />
        </div>
      </div>
    </Drawer>

    <!-- Auto-Revert Settings Dialog -->
    <Dialog
      v-model:visible="showAutoRevertDialog"
      header="Ustawienia auto-przywracania"
      modal
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Skonfiguruj automatyczne przywracanie nieautoryzowanych zmian w wizytówce.
        </p>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">Numer telefonu</p>
              <p class="text-xs text-gray-500">Przywróć przy zmianie przez Google</p>
            </div>
            <InputSwitch v-model="autoRevertSettings.phone" />
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">Godziny otwarcia</p>
              <p class="text-xs text-gray-500">Przywróć przy zmianie przez Google</p>
            </div>
            <InputSwitch v-model="autoRevertSettings.hours" />
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">Opis firmy</p>
              <p class="text-xs text-gray-500">Przywróć przy zmianie przez Google</p>
            </div>
            <InputSwitch v-model="autoRevertSettings.description" />
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">Kategorie</p>
              <p class="text-xs text-gray-500">Przywróć przy zmianie przez Google</p>
            </div>
            <InputSwitch v-model="autoRevertSettings.categories" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showAutoRevertDialog = false" />
        <Button label="Zapisz" icon="pi pi-check" @click="saveAutoRevertSettings" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Rating from 'primevue/rating';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Drawer from 'primevue/drawer';
import Dialog from 'primevue/dialog';
import InputSwitch from 'primevue/inputswitch';

// Feature gating
import { useFeatures } from '../composables/useFeatures';
import LimitWarningBanner from '../components/gtrack/common/LimitWarningBanner.vue';

const { can, getLimit, getLimitStatus } = useFeatures();

const toast = useToast();
const router = useRouter();

const isLoading = ref(false);
const activeTabIndex = ref(0);
const incidentTypeFilter = ref(null);
const incidentStatusFilter = ref(null);
const dateRange = ref(null);
const selectedIncidents = ref([]);
const showIncidentDrawer = ref(false);
const showAutoRevertDialog = ref(false);
const selectedIncident = ref(null);

// Auto-revert settings (Enterprise only)
const autoRevertSettings = reactive({
  phone: true,
  hours: true,
  description: false,
  categories: false
});

// Mock incidents data
const incidents = ref([
  {
    id: 'inc001',
    locationId: 'loc1',
    type: 'PROFILE_CHANGE',
    description: 'Numer telefonu został zmieniony przez Google.',
    field: 'phone',
    oldValue: '+48 123 456 789',
    newValue: '+48 111 222 333',
    createdAt: '2025-11-27T08:00:00Z',
    status: 'NEW',
    autoReverted: false,
    evidence: null
  },
  {
    id: 'inc002',
    locationId: 'loc1',
    type: 'REVIEW_REMOVED',
    description: 'Recenzja od użytkownika "Jan K." została usunięta z Google.',
    field: null,
    oldValue: null,
    newValue: null,
    createdAt: '2025-11-26T14:30:00Z',
    status: 'NEW',
    autoReverted: false,
    evidence: { author: 'Jan K.', rating: 5, content: 'Świetna obsługa!' }
  },
  {
    id: 'inc003',
    locationId: 'loc1',
    type: 'MEDIA_CHANGE',
    description: 'Zdjęcie "exterior-01.jpg" zostało usunięte z galerii.',
    field: 'media',
    oldValue: 'exterior-01.jpg',
    newValue: null,
    createdAt: '2025-11-25T10:15:00Z',
    status: 'IN_PROGRESS',
    autoReverted: false,
    evidence: { mediaId: 'media005', category: 'EXTERIOR' }
  },
  {
    id: 'inc004',
    locationId: 'loc1',
    type: 'PROFILE_CHANGE',
    description: 'Godziny otwarcia w sobotę zostały automatycznie przywrócone.',
    field: 'hours.saturday',
    oldValue: '10:00 - 22:00',
    newValue: '10:00 - 18:00',
    createdAt: '2025-11-24T16:00:00Z',
    status: 'RESOLVED',
    autoReverted: true,
    evidence: null
  },
  {
    id: 'inc005',
    locationId: 'loc1',
    type: 'POST_ERROR',
    description: 'Publikacja posta "Promocja zimowa" nie powiodła się.',
    field: null,
    oldValue: null,
    newValue: null,
    createdAt: '2025-11-23T11:00:00Z',
    status: 'IGNORED',
    autoReverted: false,
    evidence: { postId: 'p104', error: 'Media file too large' }
  }
]);

// Mock change history
const changeHistory = ref([
  { id: 'ch001', locationId: 'loc1', timestamp: '2025-11-27T08:00:00Z', field: 'phone', oldValue: '+48 123 456 789', newValue: '+48 111 222 333', changedBy: 'GOOGLE_UPDATE', authorized: false },
  { id: 'ch002', locationId: 'loc1', timestamp: '2025-11-26T15:30:00Z', field: 'description', oldValue: 'Najlepsza kawiarnia w mieście', newValue: 'Najlepsza kawiarnia w centrum Dublina', changedBy: 'USER', authorized: true },
  { id: 'ch003', locationId: 'loc1', timestamp: '2025-11-25T10:15:00Z', field: 'media', oldValue: 'exterior-01.jpg', newValue: null, changedBy: 'GOOGLE_UPDATE', authorized: false },
  { id: 'ch004', locationId: 'loc1', timestamp: '2025-11-24T16:00:00Z', field: 'hours.saturday', oldValue: '10:00 - 22:00', newValue: '10:00 - 18:00', changedBy: 'GOOGLE_UPDATE', authorized: false },
  { id: 'ch005', locationId: 'loc1', timestamp: '2025-11-20T09:00:00Z', field: 'category', oldValue: 'Restauracja', newValue: 'Kawiarnia', changedBy: 'USER', authorized: true }
]);

// Mock removed reviews
const removedReviews = ref([
  { reviewId: 'rev001', locationId: 'loc1', author: 'Jan K.', rating: 5, oldContent: 'Świetna obsługa! Polecam każdemu.', createdAt: '2025-10-15T12:00:00Z', removedAt: '2025-11-26T14:30:00Z' },
  { reviewId: 'rev002', locationId: 'loc1', author: 'Anna M.', rating: 1, oldContent: 'Bardzo długi czas oczekiwania.', createdAt: '2025-09-20T18:00:00Z', removedAt: '2025-11-20T10:00:00Z' },
  { reviewId: 'rev003', locationId: 'loc1', author: 'Piotr W.', rating: 4, oldContent: 'Dobre jedzenie, miła atmosfera.', createdAt: '2025-08-10T14:30:00Z', removedAt: '2025-11-15T08:00:00Z' }
]);

// Feature gating computed properties
const incidentsCount = computed(() => incidents.value.length);
const maxIncidentsPerMonth = computed(() => getLimit('monitoring', 'maxIncidentsPerMonth') || 50);
const incidentsLimitStatus = computed(() =>
  getLimitStatus('monitoring', 'maxIncidentsPerMonth', incidentsCount.value)
);
const historyRetentionDays = computed(() =>
  getLimit('monitoringChangeHistory', 'historyRetentionDays') || 7
);

// Filter options
const incidentTypeOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Zmiana profilu', value: 'PROFILE_CHANGE' },
  { label: 'Usunięta recenzja', value: 'REVIEW_REMOVED' },
  { label: 'Zmiana mediów', value: 'MEDIA_CHANGE' },
  { label: 'Błąd posta', value: 'POST_ERROR' }
];

const incidentStatusOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Nowe', value: 'NEW' },
  { label: 'W toku', value: 'IN_PROGRESS' },
  { label: 'Rozwiązane', value: 'RESOLVED' },
  { label: 'Zignorowane', value: 'IGNORED' }
];

// Computed
const openIncidents = computed(() => incidents.value.filter(i => i.status === 'NEW' || i.status === 'IN_PROGRESS').length);

const statsCards = computed(() => [
  {
    key: 'open',
    label: 'Otwarte',
    value: openIncidents.value,
    icon: 'pi-exclamation-circle',
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    key: 'week',
    label: 'Ostatnie 7 dni',
    value: incidents.value.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    icon: 'pi-calendar',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'resolved',
    label: 'Rozwiązane',
    value: incidents.value.filter(i => i.status === 'RESOLVED').length,
    icon: 'pi-check-circle',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'autoReverted',
    label: 'Auto-przywrócone',
    value: incidents.value.filter(i => i.autoReverted).length,
    icon: 'pi-undo',
    iconColor: can('monitoringAutoRevert') ? 'text-purple-600' : 'text-gray-400',
    bgColor: can('monitoringAutoRevert') ? 'bg-purple-50' : 'bg-gray-100',
    subtext: !can('monitoringAutoRevert') ? 'Enterprise' : null
  },
  {
    key: 'mttr',
    label: 'MTTR',
    value: '4.2h',
    subtext: 'śr. czas reakcji',
    icon: 'pi-clock',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    key: 'limit',
    label: 'Limit miesięczny',
    value: `${incidentsCount.value}/${maxIncidentsPerMonth.value}`,
    icon: 'pi-database',
    iconColor: incidentsLimitStatus.value?.severity === 'danger' ? 'text-red-600' :
               incidentsLimitStatus.value?.severity === 'warning' ? 'text-orange-600' : 'text-blue-600',
    bgColor: incidentsLimitStatus.value?.severity === 'danger' ? 'bg-red-50' :
             incidentsLimitStatus.value?.severity === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
  }
]);

const filteredIncidents = computed(() => {
  let result = [...incidents.value];

  if (incidentTypeFilter.value) {
    result = result.filter(i => i.type === incidentTypeFilter.value);
  }

  if (incidentStatusFilter.value) {
    result = result.filter(i => i.status === incidentStatusFilter.value);
  }

  if (dateRange.value && dateRange.value[0]) {
    const startDate = dateRange.value[0];
    const endDate = dateRange.value[1] || new Date();
    result = result.filter(i => {
      const incidentDate = new Date(i.createdAt);
      return incidentDate >= startDate && incidentDate <= endDate;
    });
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Methods
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function getTypeLabel(type) {
  const labels = {
    PROFILE_CHANGE: 'Zmiana profilu',
    REVIEW_REMOVED: 'Usunięta recenzja',
    MEDIA_CHANGE: 'Zmiana mediów',
    POST_ERROR: 'Błąd posta',
    OTHER: 'Inne'
  };
  return labels[type] || type;
}

function getTypeSeverity(type) {
  const severities = {
    PROFILE_CHANGE: 'warn',
    REVIEW_REMOVED: 'danger',
    MEDIA_CHANGE: 'info',
    POST_ERROR: 'danger',
    OTHER: 'secondary'
  };
  return severities[type] || 'secondary';
}

function getTypeIcon(type) {
  const icons = {
    PROFILE_CHANGE: 'pi-id-card',
    REVIEW_REMOVED: 'pi-star',
    MEDIA_CHANGE: 'pi-images',
    POST_ERROR: 'pi-exclamation-triangle',
    OTHER: 'pi-cog'
  };
  return icons[type] || 'pi-cog';
}

function getTypeBgColor(type) {
  const colors = {
    PROFILE_CHANGE: 'bg-orange-500',
    REVIEW_REMOVED: 'bg-red-500',
    MEDIA_CHANGE: 'bg-blue-500',
    POST_ERROR: 'bg-yellow-500',
    OTHER: 'bg-gray-500'
  };
  return colors[type] || 'bg-gray-500';
}

function getStatusLabel(status) {
  const labels = { NEW: 'Nowy', IN_PROGRESS: 'W toku', RESOLVED: 'Rozwiązany', IGNORED: 'Zignorowany' };
  return labels[status] || status;
}

function getStatusSeverity(status) {
  const severities = { NEW: 'danger', IN_PROGRESS: 'warn', RESOLVED: 'success', IGNORED: 'secondary' };
  return severities[status] || 'secondary';
}

function getChangedByLabel(changedBy) {
  const labels = { USER: 'Użytkownik', GOOGLE_UPDATE: 'Google', SYSTEM: 'System' };
  return labels[changedBy] || changedBy;
}

function clearFilters() {
  incidentTypeFilter.value = null;
  incidentStatusFilter.value = null;
  dateRange.value = null;
}

function openIncidentDrawer(incident) {
  selectedIncident.value = { ...incident };
  showIncidentDrawer.value = true;
}

function resolveIncident(incident) {
  incident.status = 'RESOLVED';
  showIncidentDrawer.value = false;
  toast.add({ severity: 'success', summary: 'Rozwiązano', detail: 'Incydent został oznaczony jako rozwiązany', life: 3000 });
}

function ignoreIncident(incident) {
  incident.status = 'IGNORED';
  showIncidentDrawer.value = false;
  toast.add({ severity: 'info', summary: 'Zignorowano', detail: 'Incydent został zignorowany', life: 3000 });
}

function restoreIncident(incident) {
  if (!can('monitoringAutoRevert')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Przywracanie wymaga planu Enterprise', life: 3000 });
    return;
  }
  incident.status = 'RESOLVED';
  incident.autoReverted = true;
  toast.add({ severity: 'success', summary: 'Przywrócono', detail: `Przywrócono wartość "${incident.oldValue}"`, life: 3000 });
  showIncidentDrawer.value = false;
}

function revertIncident(incident) {
  if (!can('monitoringAutoRevert')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Przywracanie wymaga planu Enterprise', life: 3000 });
    return;
  }
  incident.status = 'RESOLVED';
  incident.autoReverted = true;
  toast.add({ severity: 'success', summary: 'Przywrócono', detail: `Przywrócono wartość "${incident.oldValue}"`, life: 3000 });
}

function restoreValue(change) {
  if (!can('monitoringAutoRevert')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Przywracanie wymaga planu Enterprise', life: 3000 });
    return;
  }
  toast.add({ severity: 'success', summary: 'Przywrócono', detail: `Przywrócono pole "${change.field}" do "${change.oldValue}"`, life: 3000 });
}

function bulkResolve() {
  selectedIncidents.value.forEach(id => {
    const incident = incidents.value.find(i => i.id === id);
    if (incident) incident.status = 'RESOLVED';
  });
  toast.add({ severity: 'success', summary: 'Rozwiązano', detail: `${selectedIncidents.value.length} incydentów oznaczono jako rozwiązane`, life: 3000 });
  selectedIncidents.value = [];
}

function bulkRevert() {
  if (!can('monitoringAutoRevert')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Przywracanie wymaga planu Enterprise', life: 3000 });
    return;
  }
  let reverted = 0;
  selectedIncidents.value.forEach(id => {
    const incident = incidents.value.find(i => i.id === id);
    if (incident && incident.oldValue) {
      incident.status = 'RESOLVED';
      incident.autoReverted = true;
      reverted++;
    }
  });
  toast.add({ severity: 'success', summary: 'Przywrócono', detail: `Przywrócono ${reverted} zmian`, life: 3000 });
  selectedIncidents.value = [];
}

function bulkIgnore() {
  selectedIncidents.value.forEach(id => {
    const incident = incidents.value.find(i => i.id === id);
    if (incident) incident.status = 'IGNORED';
  });
  toast.add({ severity: 'info', summary: 'Zignorowano', detail: `${selectedIncidents.value.length} incydentów zignorowano`, life: 3000 });
  selectedIncidents.value = [];
}

function exportReport() {
  toast.add({ severity: 'info', summary: 'Eksport', detail: 'Generowanie raportu...', life: 3000 });
}

function exportHistory() {
  toast.add({ severity: 'info', summary: 'Eksport', detail: 'Eksportowanie historii zmian...', life: 3000 });
}

function exportRemovedReviews() {
  toast.add({ severity: 'info', summary: 'Eksport', detail: 'Eksportowanie usuniętych opinii do CSV...', life: 3000 });
}

function openAutoRevertSettings() {
  if (!can('monitoringAutoRevert')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Auto-przywracanie wymaga planu Enterprise', life: 3000 });
    return;
  }
  showAutoRevertDialog.value = true;
}

function saveAutoRevertSettings() {
  showAutoRevertDialog.value = false;
  toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Ustawienia auto-przywracania zostały zapisane', life: 3000 });
}

function navigateToSettings() {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({
    name: 'settings',
    params: { locationId },
    query: { tab: 'business', highlight: 'monitoring' }
  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
