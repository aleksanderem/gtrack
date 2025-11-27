<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Smart Tasks</h1>
          <p class="text-sm text-gray-500 mt-1">Priorytetowe zadania SEO dla poprawy widoczności w Google</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Auto-detection button - gated by taskAutoDetection (Professional+) -->
          <Button
            v-if="can('taskAutoDetection')"
            label="Uruchom audyt"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            :loading="isAuditing"
            @click="runAudit"
          />
          <Button
            v-else
            label="Uruchom audyt"
            icon="pi pi-lock"
            severity="secondary"
            outlined
            disabled
            v-tooltip.bottom="'Auto-wykrywanie dostępne w planie Professional'"
          />

          <!-- Add task button - disabled when at limit -->
          <Button
            label="Dodaj zadanie"
            icon="pi pi-plus"
            :disabled="activeTasksCount >= maxActiveTasks"
            @click="showAddTaskDialog = true"
            v-tooltip.bottom="activeTasksCount >= maxActiveTasks ? 'Osiągnięto limit aktywnych zadań' : ''"
          />
        </div>
      </div>

      <!-- Limit Warning Banner -->
      <LimitWarningBanner
        v-if="tasksLimitStatus && tasksLimitStatus.percentage >= 75"
        :status="tasksLimitStatus"
        @upgrade="navigateToSettings"
      />

      <!-- Statistics Panel -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card v-for="stat in statsCards" :key="stat.key" class="border-0 shadow-sm">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
              </div>
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="stat.bgColor"
              >
                <i :class="['pi', stat.icon, stat.iconColor]" />
              </div>
            </div>
            <!-- Premium badge for AI stats -->
            <div v-if="stat.premium && !can(stat.premium)" class="mt-2">
              <Tag value="Premium" severity="warn" class="text-xs" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Premium Features Info -->
      <div v-if="!can('taskAutoDetection') || !can('taskPrioritization')"
           class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-sparkles text-blue-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-1">Zwiększ efektywność z funkcjami Premium</h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p v-if="!can('taskAutoDetection')">
                <i class="pi pi-bolt mr-1" /><strong>Auto-wykrywanie</strong> (Professional) - Automatyczne wykrywanie problemów SEO
              </p>
              <p v-if="!can('taskPrioritization')">
                <i class="pi pi-sparkles mr-1" /><strong>Priorytetyzacja AI</strong> (Enterprise) - Inteligentne ustalanie priorytetów
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

      <!-- Filters Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-gray-200">
        <div class="flex flex-wrap items-center gap-3">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="Szukaj zadań..." class="w-64" />
          </IconField>

          <Select
            v-model="statusFilter"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Status"
            class="w-40"
          />

          <Select
            v-model="priorityFilter"
            :options="priorityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Priorytet"
            class="w-40"
          />

          <Select
            v-model="typeFilter"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Typ"
            class="w-40"
          />

          <Button
            icon="pi pi-filter-slash"
            severity="secondary"
            text
            @click="clearFilters"
            v-tooltip="'Wyczyść filtry'"
          />

          <div class="flex-1" />

          <SelectButton v-model="viewMode" :options="viewModes" optionLabel="icon" optionValue="value">
            <template #option="{ option }">
              <i :class="option.icon" />
            </template>
          </SelectButton>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <Transition name="fade">
        <div
          v-if="selectedTasks.length > 0"
          class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between"
        >
          <span class="text-sm font-medium text-blue-800">
            {{ selectedTasks.length }} z {{ filteredTasks.length }} zaznaczonych
          </span>
          <div class="flex items-center gap-2">
            <Button
              label="Oznacz jako wykonane"
              icon="pi pi-check"
              severity="success"
              size="small"
              @click="bulkMarkDone"
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

      <!-- Tasks DataTable View -->
      <Card v-if="viewMode === 'table'" class="border-0 shadow-sm">
        <template #content>
          <DataTable
            v-model:selection="selectedTasks"
            :value="filteredTasks"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
            dataKey="taskId"
            :loading="isLoading"
            stripedRows
            rowHover
            @row-click="(e) => openTaskDrawer(e.data)"
            class="cursor-pointer"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="name" header="Zadanie" style="min-width: 250px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="getTypeBgColor(data.type)"
                  >
                    <i :class="['pi', getTypeIcon(data.type), 'text-white']" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-gray-900">{{ data.name }}</p>
                      <!-- AI badge for high priority tasks when AI prioritization is available -->
                      <Tag
                        v-if="can('taskPrioritization') && data.priority === 'HIGH' && data.aiScore"
                        severity="info"
                        class="text-xs"
                      >
                        <template #value>
                          <div class="flex items-center gap-1">
                            <i class="pi pi-sparkles text-xs" />
                            <span>AI</span>
                          </div>
                        </template>
                      </Tag>
                    </div>
                    <p class="text-xs text-gray-500">{{ getTypeLabel(data.type) }}</p>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="priority" header="Priorytet" sortable style="width: 120px">
              <template #body="{ data }">
                <Tag
                  :value="getPriorityLabel(data.priority)"
                  :severity="getPrioritySeverity(data.priority)"
                />
              </template>
            </Column>

            <Column field="status" header="Status" sortable style="width: 130px">
              <template #body="{ data }">
                <Tag
                  :value="getStatusLabel(data.status)"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>

            <Column field="createdAt" header="Utworzono" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="text-sm text-gray-600">{{ formatDate(data.createdAt) }}</span>
              </template>
            </Column>

            <Column field="dueAt" header="Termin" sortable style="width: 120px">
              <template #body="{ data }">
                <span v-if="data.dueAt" class="text-sm" :class="isOverdue(data.dueAt) ? 'text-red-600 font-medium' : 'text-gray-600'">
                  {{ formatDate(data.dueAt) }}
                </span>
                <span v-else class="text-gray-400">—</span>
              </template>
            </Column>

            <Column header="Akcje" style="width: 140px">
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <Button
                    v-if="data.status !== 'DONE'"
                    icon="pi pi-play"
                    severity="success"
                    text
                    size="small"
                    @click.stop="executeTask(data)"
                    v-tooltip="'Wykonaj'"
                  />
                  <Button
                    v-if="data.status !== 'DONE'"
                    icon="pi pi-check"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="markAsDone(data)"
                    v-tooltip="'Oznacz jako wykonane'"
                  />
                  <Button
                    v-if="data.status !== 'IGNORED'"
                    icon="pi pi-times"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="ignoreTask(data)"
                    v-tooltip="'Ignoruj'"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-12">
                <i class="pi pi-check-circle text-4xl text-gray-300 mb-3" />
                <p class="text-gray-500">Brak zadań do wyświetlenia</p>
                <Button
                  v-if="can('taskAutoDetection')"
                  label="Uruchom audyt"
                  icon="pi pi-refresh"
                  class="mt-3"
                  @click="runAudit"
                />
                <Button
                  v-else
                  label="Dodaj zadanie ręcznie"
                  icon="pi pi-plus"
                  class="mt-3"
                  @click="showAddTaskDialog = true"
                />
              </div>
            </template>
          </DataTable>
        </template>
      </Card>

      <!-- Tasks Card View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="task in filteredTasks"
          :key="task.taskId"
          class="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          @click="openTaskDrawer(task)"
        >
          <template #content>
            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getTypeBgColor(task.type)"
                >
                  <i :class="['pi', getTypeIcon(task.type), 'text-white']" />
                </div>
                <div class="flex gap-1 flex-wrap justify-end">
                  <Tag
                    v-if="can('taskPrioritization') && task.priority === 'HIGH' && task.aiScore"
                    severity="info"
                    class="text-xs"
                  >
                    <template #value>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-sparkles text-xs" />
                        <span>AI</span>
                      </div>
                    </template>
                  </Tag>
                  <Tag
                    :value="getPriorityLabel(task.priority)"
                    :severity="getPrioritySeverity(task.priority)"
                    class="text-xs"
                  />
                  <Tag
                    :value="getStatusLabel(task.status)"
                    :severity="getStatusSeverity(task.status)"
                    class="text-xs"
                  />
                </div>
              </div>

              <div>
                <h3 class="font-semibold text-gray-900">{{ task.name }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ getTypeLabel(task.type) }}</p>
              </div>

              <p class="text-sm text-gray-600 line-clamp-2">{{ task.description }}</p>

              <div class="flex items-center justify-between pt-2 border-t text-xs text-gray-400">
                <span>{{ formatDate(task.createdAt) }}</span>
                <span v-if="task.dueAt" :class="isOverdue(task.dueAt) ? 'text-red-500' : ''">
                  <i class="pi pi-calendar mr-1" />{{ formatDate(task.dueAt) }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Task Details Drawer -->
    <Drawer
      v-model:visible="showTaskDrawer"
      position="right"
      :style="{ width: '550px' }"
      :header="selectedTask?.name || 'Szczegóły zadania'"
    >
      <div v-if="selectedTask" class="space-y-6">
        <!-- Task Header -->
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="getTypeBgColor(selectedTask.type)"
          >
            <i :class="['pi', getTypeIcon(selectedTask.type), 'text-white text-xl']" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <Tag
                v-if="can('taskPrioritization') && selectedTask.priority === 'HIGH' && selectedTask.aiScore"
                severity="info"
              >
                <template #value>
                  <div class="flex items-center gap-1">
                    <i class="pi pi-sparkles text-xs" />
                    <span>AI Score: {{ selectedTask.aiScore }}</span>
                  </div>
                </template>
              </Tag>
              <Tag
                :value="getPriorityLabel(selectedTask.priority)"
                :severity="getPrioritySeverity(selectedTask.priority)"
              />
              <Tag
                :value="getStatusLabel(selectedTask.status)"
                :severity="getStatusSeverity(selectedTask.status)"
              />
            </div>
            <p class="text-sm text-gray-500">{{ getTypeLabel(selectedTask.type) }}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Opis</h4>
          <p class="text-gray-700 leading-relaxed">{{ selectedTask.description }}</p>
        </div>

        <!-- Evidence -->
        <div v-if="selectedTask.evidence" class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-3">Dowody / Dane</h4>
          <div class="space-y-2 text-sm">
            <div v-for="(value, key) in selectedTask.evidence" :key="key" class="flex justify-between">
              <span class="text-gray-500">{{ key }}</span>
              <span class="font-medium">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- Suggested Action -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-900 mb-2">Sugerowane działanie</h4>
          <p class="text-blue-800 text-sm">{{ selectedTask.suggestedAction }}</p>
        </div>

        <!-- Dates -->
        <div class="flex items-center justify-between text-sm">
          <div>
            <span class="text-gray-500">Utworzono:</span>
            <span class="font-medium ml-2">{{ formatDate(selectedTask.createdAt) }}</span>
          </div>
          <div v-if="selectedTask.dueAt">
            <span class="text-gray-500">Termin:</span>
            <span class="font-medium ml-2" :class="isOverdue(selectedTask.dueAt) ? 'text-red-600' : ''">
              {{ formatDate(selectedTask.dueAt) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t">
          <Button
            v-if="selectedTask.status !== 'DONE'"
            label="Wykonaj teraz"
            icon="pi pi-play"
            class="flex-1"
            @click="executeTask(selectedTask)"
          />
          <Button
            v-if="selectedTask.status !== 'DONE'"
            label="Wykonane"
            icon="pi pi-check"
            severity="success"
            class="flex-1"
            @click="markAsDone(selectedTask)"
          />
          <Button
            v-if="selectedTask.status !== 'IGNORED'"
            label="Ignoruj"
            icon="pi pi-times"
            severity="secondary"
            @click="ignoreTask(selectedTask)"
          />
        </div>
      </div>
    </Drawer>

    <!-- Add Task Dialog -->
    <Dialog
      v-model:visible="showAddTaskDialog"
      header="Dodaj zadanie"
      modal
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nazwa zadania</label>
          <InputText v-model="newTask.name" class="w-full" placeholder="Np. Dodaj zdjęcia wnętrza" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Typ</label>
          <Select
            v-model="newTask.type"
            :options="typeOptions.filter(t => t.value)"
            optionLabel="label"
            optionValue="value"
            placeholder="Wybierz typ"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priorytet</label>
          <SelectButton
            v-model="newTask.priority"
            :options="[{ label: 'Niski', value: 'LOW' }, { label: 'Średni', value: 'MEDIUM' }, { label: 'Wysoki', value: 'HIGH' }]"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Opis</label>
          <Textarea v-model="newTask.description" rows="3" class="w-full" placeholder="Szczegółowy opis zadania..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Termin (opcjonalnie)</label>
          <DatePicker v-model="newTask.dueAt" class="w-full" dateFormat="dd/mm/yy" showIcon />
        </div>
      </div>

      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showAddTaskDialog = false" />
        <Button label="Dodaj" icon="pi pi-plus" @click="addTask" :disabled="!newTask.name || !newTask.type" />
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
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// Feature gating
import { useFeatures } from '../composables/useFeatures';
import LimitWarningBanner from '../components/gtrack/common/LimitWarningBanner.vue';

const { can, getLimit, getLimitStatus } = useFeatures();

const toast = useToast();
const router = useRouter();

const isLoading = ref(false);
const isAuditing = ref(false);
const viewMode = ref('table');
const searchQuery = ref('');
const statusFilter = ref(null);
const priorityFilter = ref(null);
const typeFilter = ref(null);
const selectedTasks = ref([]);
const showTaskDrawer = ref(false);
const showAddTaskDialog = ref(false);
const selectedTask = ref(null);

// Mock tasks data
const tasks = ref([
  {
    taskId: 'task001',
    locationId: 'loc1',
    name: 'Dodaj brakujące zdjęcia wnętrza',
    type: 'MEDIA',
    priority: 'HIGH',
    status: 'NEW',
    aiScore: 92,
    suggestedAction: 'Przejdź do modułu Media i dodaj co najmniej 3 zdjęcia wnętrza lokalu.',
    evidence: { 'Obecna liczba zdjęć': 2, 'Rekomendowana': '5-10', 'Konkurencja średnio': 8 },
    description: 'Twoja wizytówka ma tylko 2 zdjęcia wnętrza, podczas gdy konkurenci mają średnio 8. Dodanie więcej zdjęć zwiększy atrakcyjność profilu i może poprawić CTR o 15-20%.',
    createdAt: '2025-11-27T08:00:00Z',
    dueAt: '2025-12-01T23:59:00Z'
  },
  {
    taskId: 'task002',
    locationId: 'loc1',
    name: 'Odpowiedz na negatywną opinię',
    type: 'REVIEW',
    priority: 'HIGH',
    status: 'NEW',
    aiScore: 95,
    suggestedAction: 'Przejdź do modułu Opinie i odpowiedz na recenzję od Tomasz K. (1 gwiazdka).',
    evidence: { 'Nieodpowiedziane opinie': 3, 'Najstarsza bez odpowiedzi': '5 dni' },
    description: 'Masz 3 nieodpowiedziane opinie, w tym jedną negatywną od 5 dni. Szybka odpowiedź na negatywne recenzje pokazuje zaangażowanie i może zmienić nastawienie klienta.',
    createdAt: '2025-11-26T10:00:00Z',
    dueAt: '2025-11-28T23:59:00Z'
  },
  {
    taskId: 'task003',
    locationId: 'loc1',
    name: 'Zaktualizuj godziny otwarcia',
    type: 'PROFILE',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    suggestedAction: 'Przejdź do Wizytówki i zaktualizuj godziny otwarcia na okres świąteczny.',
    evidence: { 'Ostatnia aktualizacja': '3 miesiące temu', 'Zbliżające się święta': 'Boże Narodzenie' },
    description: 'Twoje godziny otwarcia nie były aktualizowane od 3 miesięcy. Przed okresem świątecznym warto zaktualizować harmonogram, aby uniknąć rozczarowania klientów.',
    createdAt: '2025-11-25T14:00:00Z',
    dueAt: '2025-12-20T23:59:00Z'
  },
  {
    taskId: 'task004',
    locationId: 'loc1',
    name: 'Opublikuj post o promocji',
    type: 'POST',
    priority: 'MEDIUM',
    status: 'NEW',
    suggestedAction: 'Przejdź do modułu Posty i stwórz post o aktualnej promocji zimowej.',
    evidence: { 'Ostatni post': '14 dni temu', 'Konkurenci średnio': '2-3 posty/tydzień' },
    description: 'Nie publikowałeś posta od 2 tygodni. Regularne posty zwiększają zaangażowanie i widoczność w wyszukiwarce lokalnej.',
    createdAt: '2025-11-24T09:00:00Z',
    dueAt: null
  },
  {
    taskId: 'task005',
    locationId: 'loc1',
    name: 'Dodaj kategorię "Kawiarnia"',
    type: 'PROFILE',
    priority: 'LOW',
    status: 'DONE',
    suggestedAction: 'Przejdź do Wizytówki > Kategorie i dodaj kategorię "Kawiarnia".',
    evidence: { 'Obecne kategorie': 2, 'Sugerowane': 'Kawiarnia, Restauracja' },
    description: 'Twoja wizytówka ma tylko 2 kategorie. Dodanie kategorii "Kawiarnia" pomoże dotrzeć do klientów szukających tej usługi.',
    createdAt: '2025-11-20T11:00:00Z',
    dueAt: null
  },
  {
    taskId: 'task006',
    locationId: 'loc1',
    name: 'Sprawdź usunięte zdjęcie',
    type: 'AUDIT',
    priority: 'HIGH',
    status: 'IGNORED',
    aiScore: 78,
    suggestedAction: 'Sprawdź moduł Monitoring i oceń, czy usunięcie zdjęcia było zamierzone.',
    evidence: { 'Usunięte zdjęcie': 'exterior-01.jpg', 'Data usunięcia': '2025-11-22' },
    description: 'System wykrył usunięcie zdjęcia z Twojej wizytówki. Sprawdź, czy było to zamierzone działanie.',
    createdAt: '2025-11-22T16:00:00Z',
    dueAt: null
  }
]);

// Feature gating computed properties
const activeTasksCount = computed(() =>
  tasks.value.filter(t => t.status !== 'DONE' && t.status !== 'IGNORED').length
);
const maxActiveTasks = computed(() => getLimit('tasks', 'maxActiveTasks') || 10);
const tasksLimitStatus = computed(() =>
  getLimitStatus('tasks', 'maxActiveTasks', activeTasksCount.value)
);

// New task form
const newTask = reactive({
  name: '',
  type: null,
  priority: 'MEDIUM',
  description: '',
  dueAt: null
});

// Filter options
const statusOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Nowe', value: 'NEW' },
  { label: 'W toku', value: 'IN_PROGRESS' },
  { label: 'Wykonane', value: 'DONE' },
  { label: 'Zignorowane', value: 'IGNORED' }
];

const priorityOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Wysoki', value: 'HIGH' },
  { label: 'Średni', value: 'MEDIUM' },
  { label: 'Niski', value: 'LOW' }
];

const typeOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Posty', value: 'POST' },
  { label: 'Opinie', value: 'REVIEW' },
  { label: 'Profil', value: 'PROFILE' },
  { label: 'Media', value: 'MEDIA' },
  { label: 'Audyt', value: 'AUDIT' },
  { label: 'Inne', value: 'OTHER' }
];

const viewModes = [
  { value: 'table', icon: 'pi pi-list' },
  { value: 'grid', icon: 'pi pi-th-large' }
];

// Computed
const statsCards = computed(() => [
  {
    key: 'new',
    label: 'Nowe',
    value: tasks.value.filter(t => t.status === 'NEW').length,
    icon: 'pi-bell',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'inProgress',
    label: 'W toku',
    value: tasks.value.filter(t => t.status === 'IN_PROGRESS').length,
    icon: 'pi-spin pi-spinner',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    key: 'done',
    label: 'Wykonane',
    value: tasks.value.filter(t => t.status === 'DONE').length,
    icon: 'pi-check-circle',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'ignored',
    label: 'Zignorowane',
    value: tasks.value.filter(t => t.status === 'IGNORED').length,
    icon: 'pi-times-circle',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    key: 'high',
    label: 'Wysoki priorytet',
    value: tasks.value.filter(t => t.priority === 'HIGH' && t.status !== 'DONE' && t.status !== 'IGNORED').length,
    icon: 'pi-exclamation-triangle',
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    key: 'limit',
    label: 'Limit zadań',
    value: `${activeTasksCount.value}/${maxActiveTasks.value}`,
    icon: 'pi-database',
    iconColor: tasksLimitStatus.value?.severity === 'danger' ? 'text-red-600' :
               tasksLimitStatus.value?.severity === 'warning' ? 'text-orange-600' : 'text-blue-600',
    bgColor: tasksLimitStatus.value?.severity === 'danger' ? 'bg-red-50' :
             tasksLimitStatus.value?.severity === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
  }
]);

const filteredTasks = computed(() => {
  let result = [...tasks.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    result = result.filter(t => t.status === statusFilter.value);
  }

  if (priorityFilter.value) {
    result = result.filter(t => t.priority === priorityFilter.value);
  }

  if (typeFilter.value) {
    result = result.filter(t => t.type === typeFilter.value);
  }

  // Sort by priority (HIGH first) then by date
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return result.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

// Methods
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date();
}

function getTypeLabel(type) {
  const labels = { POST: 'Posty', REVIEW: 'Opinie', PROFILE: 'Profil', MEDIA: 'Media', AUDIT: 'Audyt', OTHER: 'Inne' };
  return labels[type] || type;
}

function getTypeIcon(type) {
  const icons = { POST: 'pi-pencil', REVIEW: 'pi-star', PROFILE: 'pi-id-card', MEDIA: 'pi-images', AUDIT: 'pi-search', OTHER: 'pi-cog' };
  return icons[type] || 'pi-cog';
}

function getTypeBgColor(type) {
  const colors = {
    POST: 'bg-purple-500',
    REVIEW: 'bg-yellow-500',
    PROFILE: 'bg-blue-500',
    MEDIA: 'bg-green-500',
    AUDIT: 'bg-red-500',
    OTHER: 'bg-gray-500'
  };
  return colors[type] || 'bg-gray-500';
}

function getPriorityLabel(priority) {
  const labels = { HIGH: 'Wysoki', MEDIUM: 'Średni', LOW: 'Niski' };
  return labels[priority] || priority;
}

function getPrioritySeverity(priority) {
  const severities = { HIGH: 'danger', MEDIUM: 'warn', LOW: 'secondary' };
  return severities[priority] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { NEW: 'Nowe', IN_PROGRESS: 'W toku', DONE: 'Wykonane', IGNORED: 'Zignorowane' };
  return labels[status] || status;
}

function getStatusSeverity(status) {
  const severities = { NEW: 'info', IN_PROGRESS: 'warn', DONE: 'success', IGNORED: 'secondary' };
  return severities[status] || 'secondary';
}

function clearFilters() {
  searchQuery.value = '';
  statusFilter.value = null;
  priorityFilter.value = null;
  typeFilter.value = null;
}

function openTaskDrawer(task) {
  selectedTask.value = { ...task };
  showTaskDrawer.value = true;
}

function executeTask(task) {
  // Navigate to the appropriate module based on task type
  const routes = {
    POST: 'posts',
    REVIEW: 'reviews-list',
    PROFILE: 'content',
    MEDIA: 'media',
    AUDIT: 'dashboard'
  };
  const routeName = routes[task.type] || 'dashboard';
  task.status = 'IN_PROGRESS';
  showTaskDrawer.value = false;
  router.push({ name: routeName });
  toast.add({ severity: 'info', summary: 'Rozpoczęto', detail: 'Przechodzę do odpowiedniego modułu', life: 2000 });
}

function markAsDone(task) {
  task.status = 'DONE';
  showTaskDrawer.value = false;
  toast.add({ severity: 'success', summary: 'Wykonane', detail: 'Zadanie oznaczono jako wykonane', life: 3000 });
}

function ignoreTask(task) {
  task.status = 'IGNORED';
  showTaskDrawer.value = false;
  toast.add({ severity: 'info', summary: 'Zignorowano', detail: 'Zadanie zostało zignorowane', life: 3000 });
}

function bulkMarkDone() {
  selectedTasks.value.forEach(taskId => {
    const task = tasks.value.find(t => t.taskId === taskId);
    if (task) task.status = 'DONE';
  });
  toast.add({ severity: 'success', summary: 'Wykonane', detail: `${selectedTasks.value.length} zadań oznaczono jako wykonane`, life: 3000 });
  selectedTasks.value = [];
}

function bulkIgnore() {
  selectedTasks.value.forEach(taskId => {
    const task = tasks.value.find(t => t.taskId === taskId);
    if (task) task.status = 'IGNORED';
  });
  toast.add({ severity: 'info', summary: 'Zignorowano', detail: `${selectedTasks.value.length} zadań zignorowano`, life: 3000 });
  selectedTasks.value = [];
}

function runAudit() {
  if (!can('taskAutoDetection')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Auto-wykrywanie wymaga planu Professional', life: 3000 });
    return;
  }

  isAuditing.value = true;
  setTimeout(() => {
    isAuditing.value = false;
    toast.add({ severity: 'success', summary: 'Audyt', detail: 'Audyt zakończony, lista zadań zaktualizowana', life: 3000 });
  }, 2000);
}

function addTask() {
  if (activeTasksCount.value >= maxActiveTasks.value) {
    toast.add({ severity: 'warn', summary: 'Limit osiągnięty', detail: 'Osiągnięto limit aktywnych zadań', life: 3000 });
    return;
  }

  const task = {
    taskId: `task${Date.now()}`,
    locationId: 'loc1',
    name: newTask.name,
    type: newTask.type,
    priority: newTask.priority,
    status: 'NEW',
    suggestedAction: 'Zadanie dodane ręcznie przez użytkownika.',
    evidence: null,
    description: newTask.description || 'Brak szczegółowego opisu.',
    createdAt: new Date().toISOString(),
    dueAt: newTask.dueAt?.toISOString() || null
  };
  tasks.value.unshift(task);
  showAddTaskDialog.value = false;
  Object.assign(newTask, { name: '', type: null, priority: 'MEDIUM', description: '', dueAt: null });
  toast.add({ severity: 'success', summary: 'Dodano', detail: 'Nowe zadanie zostało dodane', life: 3000 });
}

function navigateToSettings() {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({
    name: 'settings',
    params: { locationId },
    query: { tab: 'business', highlight: 'tasks' }
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
