<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Posty</h1>
          <p class="text-sm text-gray-500 mt-1">Twórz i zarządzaj postami Google Business Profile</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- AI Content button - gated by postsAiContent (Enterprise) -->
          <Button
            v-if="can('postsAiContent')"
            label="Generuj AI"
            icon="pi pi-sparkles"
            severity="secondary"
            outlined
            @click="generateAiContent"
          />
          <Button
            v-else-if="can('postsScheduling')"
            label="Generuj AI"
            icon="pi pi-lock"
            severity="secondary"
            outlined
            disabled
            v-tooltip.bottom="'Treści AI dostępne w planie Enterprise'"
          />

          <!-- Add post button - disabled when at limit -->
          <Button
            label="Dodaj post"
            icon="pi pi-plus"
            :disabled="postsThisMonth >= maxPostsPerMonth"
            @click="openPostDialog(null)"
            v-tooltip.bottom="postsThisMonth >= maxPostsPerMonth ? 'Osiągnięto limit postów' : ''"
          />
        </div>
      </div>

      <!-- Limit Warning Banner -->
      <LimitWarningBanner
        v-if="postsLimitStatus && postsLimitStatus.percentage >= 75"
        :status="postsLimitStatus"
        @upgrade="navigateToSettings"
      />

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <Tag v-if="stat.premium && !can(stat.premium)" value="Premium" severity="warn" class="text-xs mt-2" />
          </template>
        </Card>
      </div>

      <!-- Premium Features Info -->
      <div v-if="!can('postsScheduling') || !can('postsAiContent')"
           class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-pencil text-blue-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-1">Rozszerzone publikowanie</h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p v-if="!can('postsScheduling')">
                <i class="pi pi-calendar mr-1" /><strong>Planowanie</strong> (Professional) - Harmonogram publikacji postów
              </p>
              <p v-if="!can('postsAnalytics')">
                <i class="pi pi-chart-bar mr-1" /><strong>Analityka</strong> (Professional) - Szczegółowe statystyki wyświetleń i kliknięć
              </p>
              <p v-if="!can('postsAiContent')">
                <i class="pi pi-sparkles mr-1" /><strong>Treści AI</strong> (Enterprise) - Automatyczne generowanie treści postów
              </p>
              <p>
                <i class="pi pi-database mr-1" />Aktualny limit: <strong>{{ maxPostsPerMonth }}</strong> postów/miesiąc
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

      <!-- Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              size="small"
              @click="clearFilters"
              v-tooltip="'Wyczyść filtry'"
            />
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Szukaj postów..." class="w-64" />
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
              v-model="typeFilter"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Typ"
              class="w-36"
            />
          </div>
          <div class="flex items-center gap-2">
            <SelectButton v-model="viewMode" :options="viewModes" optionLabel="icon" optionValue="value">
              <template #option="{ option }">
                <i :class="option.icon" />
              </template>
            </SelectButton>
          </div>
        </div>
      </div>

      <!-- Posts Table View -->
      <Card v-if="viewMode === 'table'" class="border-0 shadow-sm">
        <template #content>
          <DataTable
            :value="filteredPosts"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
            dataKey="id"
            :loading="isLoading"
            stripedRows
            rowHover
            @row-click="(e) => openPostDialog(e.data)"
            class="cursor-pointer"
          >
            <Column field="title" header="Tytuł" sortable style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <img
                    v-if="data.mediaUrl"
                    :src="data.mediaUrl"
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                  <div v-else class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <i class="pi pi-image text-gray-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ data.title || 'Bez tytułu' }}</p>
                    <p class="text-xs text-gray-500 truncate max-w-xs">{{ data.content }}</p>
                  </div>
                </div>
              </template>
            </Column>
            <Column field="type" header="Typ" sortable style="width: 120px">
              <template #body="{ data }">
                <Tag :value="getTypeLabel(data.type)" :severity="getTypeSeverity(data.type)" />
              </template>
            </Column>
            <Column field="status" header="Status" sortable style="width: 130px">
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
                  <Tag
                    v-if="data.scheduledAt && !data.publishedAt && !can('postsScheduling')"
                    severity="info"
                    class="text-xs"
                  >
                    <template #value>
                      <i class="pi pi-lock text-xs" />
                    </template>
                  </Tag>
                </div>
              </template>
            </Column>
            <Column field="scheduledAt" header="Data" sortable style="width: 150px">
              <template #body="{ data }">
                <div class="text-sm">
                  <p v-if="data.publishedAt" class="text-gray-700">
                    {{ formatDate(data.publishedAt) }}
                  </p>
                  <p v-else-if="data.scheduledAt" class="text-orange-600">
                    <i class="pi pi-clock mr-1" />{{ formatDate(data.scheduledAt) }}
                  </p>
                  <p v-else class="text-gray-400">—</p>
                </div>
              </template>
            </Column>

            <!-- Analytics columns - gated by postsAnalytics -->
            <Column v-if="can('postsAnalytics')" field="impressions" header="Wyświetlenia" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.impressions?.toLocaleString() || '—' }}</span>
              </template>
            </Column>
            <Column v-if="can('postsAnalytics')" field="clicks" header="Kliknięcia" sortable style="width: 110px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.clicks?.toLocaleString() || '—' }}</span>
              </template>
            </Column>

            <Column header="Akcje" style="width: 100px">
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="openPostDialog(data)"
                  />
                  <Button
                    v-if="data.status === 'failed'"
                    icon="pi pi-refresh"
                    severity="warning"
                    text
                    size="small"
                    @click.stop="retryPost(data)"
                    v-tooltip="'Ponów publikację'"
                  />
                  <Button
                    icon="pi pi-copy"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="duplicatePost(data)"
                    v-tooltip="'Duplikuj'"
                    :disabled="postsThisMonth >= maxPostsPerMonth"
                  />
                  <Button
                    v-if="data.status !== 'published'"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    size="small"
                    @click.stop="confirmDeletePost(data)"
                  />
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-inbox text-4xl text-gray-300 mb-2" />
                <p class="text-gray-500">Brak postów</p>
                <Button
                  label="Dodaj pierwszy post"
                  icon="pi pi-plus"
                  class="mt-3"
                  @click="openPostDialog(null)"
                  :disabled="postsThisMonth >= maxPostsPerMonth"
                />
              </div>
            </template>
          </DataTable>
        </template>
      </Card>

      <!-- Posts Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="post in filteredPosts"
          :key="post.id"
          class="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          @click="openPostDialog(post)"
        >
          <template #header>
            <img
              v-if="post.mediaUrl"
              :src="post.mediaUrl"
              class="w-full h-40 object-cover"
            />
            <div v-else class="w-full h-40 bg-gray-100 flex items-center justify-center">
              <i class="pi pi-image text-4xl text-gray-300" />
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <Tag :value="getTypeLabel(post.type)" :severity="getTypeSeverity(post.type)" />
                <Tag :value="getStatusLabel(post.status)" :severity="getStatusSeverity(post.status)" />
              </div>
              <h3 class="font-semibold text-gray-900">{{ post.title || 'Bez tytułu' }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2">{{ post.content }}</p>
              <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
                <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
                <span v-else-if="post.scheduledAt" class="text-orange-500">
                  <i class="pi pi-clock mr-1" />{{ formatDate(post.scheduledAt) }}
                </span>
                <div v-if="can('postsAnalytics')" class="flex items-center gap-3">
                  <span v-if="post.impressions"><i class="pi pi-eye mr-1" />{{ post.impressions }}</span>
                  <span v-if="post.clicks"><i class="pi pi-external-link mr-1" />{{ post.clicks }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Add Post Card -->
        <Card
          class="border-2 border-dashed rounded-xl cursor-pointer transition-colors"
          :class="postsThisMonth >= maxPostsPerMonth ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-blue-300'"
          @click="postsThisMonth < maxPostsPerMonth && openPostDialog(null)"
        >
          <template #content>
            <div class="flex flex-col items-center justify-center h-40 text-gray-400">
              <i :class="['text-3xl mb-2', postsThisMonth >= maxPostsPerMonth ? 'pi pi-lock' : 'pi pi-plus']" />
              <span class="text-sm font-medium">
                {{ postsThisMonth >= maxPostsPerMonth ? 'Limit osiągnięty' : 'Dodaj nowy post' }}
              </span>
              <span v-if="postsThisMonth >= maxPostsPerMonth" class="text-xs mt-1">
                {{ postsThisMonth }}/{{ maxPostsPerMonth }}
              </span>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Post Dialog -->
    <Drawer
      v-model:visible="showPostDrawer"
      position="right"
      :style="{ width: '600px' }"
      :header="editingPost ? 'Edytuj post' : 'Nowy post'"
    >
      <div class="space-y-4">
        <!-- Limit info in form -->
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Wykorzystany limit:</span>
            <span :class="postsLimitStatus?.severity === 'danger' ? 'text-red-600 font-semibold' : 'text-gray-900 font-medium'">
              {{ postsThisMonth }} / {{ maxPostsPerMonth }} postów w tym miesiącu
            </span>
          </div>
          <ProgressBar
            :value="(postsThisMonth / maxPostsPerMonth) * 100"
            :showValue="false"
            class="h-2 mt-2"
            :pt="{
              value: { class: postsLimitStatus?.severity === 'danger' ? 'bg-red-500' : postsLimitStatus?.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500' }
            }"
          />
        </div>

        <!-- Post Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Typ posta</label>
          <SelectButton
            v-model="postForm.type"
            :options="postTypes"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tytuł</label>
          <InputText v-model="postForm.title" class="w-full" placeholder="Tytuł posta (opcjonalnie)" />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Treść
            <Button
              v-if="can('postsAiContent')"
              label="Generuj AI"
              icon="pi pi-sparkles"
              size="small"
              text
              class="ml-2"
              @click="generateAiContentForForm"
            />
          </label>
          <Textarea
            v-model="postForm.content"
            rows="4"
            class="w-full"
            placeholder="Treść posta..."
            :maxlength="1500"
          />
          <div class="text-xs text-gray-400 text-right mt-1">{{ postForm.content?.length || 0 }}/1500</div>
        </div>

        <!-- Media URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Zdjęcie (URL)</label>
          <InputText v-model="postForm.mediaUrl" class="w-full" placeholder="https://..." />
          <img
            v-if="postForm.mediaUrl"
            :src="postForm.mediaUrl"
            class="mt-2 w-full h-40 object-cover rounded-lg"
            @error="postForm.mediaUrl = ''"
          />
        </div>

        <!-- CTA -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Przycisk CTA</label>
            <Select
              v-model="postForm.cta"
              :options="ctaOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Wybierz..."
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Link CTA</label>
            <InputText v-model="postForm.ctaUrl" class="w-full" placeholder="https://..." :disabled="!postForm.cta" />
          </div>
        </div>

        <!-- Date fields for OFFER/EVENT -->
        <div v-if="postForm.type === 'OFFER' || postForm.type === 'EVENT'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data rozpoczęcia</label>
            <DatePicker v-model="postForm.startTime" showTime hourFormat="24" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data zakończenia</label>
            <DatePicker v-model="postForm.endTime" showTime hourFormat="24" class="w-full" />
          </div>
        </div>

        <!-- Schedule - gated by postsScheduling -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Zaplanuj publikację
            <i v-if="!can('postsScheduling')" class="pi pi-lock text-xs text-gray-400 ml-1" />
          </label>
          <DatePicker
            v-if="can('postsScheduling')"
            v-model="postForm.scheduledAt"
            showTime
            hourFormat="24"
            class="w-full"
            placeholder="Natychmiast (pozostaw puste)"
          />
          <div v-else class="bg-blue-50 p-3 rounded-lg">
            <div class="flex items-start gap-2">
              <i class="pi pi-info-circle text-blue-600 mt-0.5" />
              <div class="text-sm text-blue-800">
                <strong>Planowanie publikacji</strong> dostępne w planie Professional.
                <Button
                  label="Odblokuj"
                  size="small"
                  link
                  class="p-0 ml-1"
                  @click="navigateToSettings"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Scheduled posts limit info -->
        <div v-if="can('postsScheduling') && scheduledPostsCount > 0" class="text-sm text-gray-500">
          <i class="pi pi-calendar mr-1" />
          Zaplanowane posty: {{ scheduledPostsCount }}/{{ maxScheduledPosts }}
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <Button
            v-if="editingPost && editingPost.status !== 'published'"
            label="Usuń"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="confirmDeletePost(editingPost)"
          />
          <div class="flex gap-2 ml-auto">
            <Button label="Anuluj" severity="secondary" text @click="showPostDrawer = false" />
            <Button
              v-if="postForm.scheduledAt && can('postsScheduling')"
              label="Zapisz i zaplanuj"
              icon="pi pi-calendar"
              @click="savePost(false)"
              :disabled="postsThisMonth >= maxPostsPerMonth && !editingPost"
            />
            <Button
              v-else
              label="Publikuj teraz"
              icon="pi pi-send"
              @click="savePost(true)"
              :disabled="postsThisMonth >= maxPostsPerMonth && !editingPost"
            />
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
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
import Drawer from 'primevue/drawer';
import DatePicker from 'primevue/datepicker';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import ConfirmDialog from 'primevue/confirmdialog';
import ProgressBar from 'primevue/progressbar';

// Feature gating
import { useFeatures } from '../composables/useFeatures';
import LimitWarningBanner from '../components/gtrack/common/LimitWarningBanner.vue';

const { can, getLimit, getLimitStatus } = useFeatures();

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const isLoading = ref(false);
const searchQuery = ref('');
const statusFilter = ref(null);
const typeFilter = ref(null);
const viewMode = ref('table');
const showPostDrawer = ref(false);
const editingPost = ref(null);

// Feature gating computed properties
const postsThisMonth = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return posts.value.filter(p =>
    new Date(p.publishedAt || p.createdAt || Date.now()) >= startOfMonth
  ).length;
});
const maxPostsPerMonth = computed(() => getLimit('posts', 'maxPostsPerMonth') || 5);
const postsLimitStatus = computed(() =>
  getLimitStatus('posts', 'maxPostsPerMonth', postsThisMonth.value)
);
const scheduledPostsCount = computed(() => posts.value.filter(p => p.status === 'planned').length);
const maxScheduledPosts = computed(() => getLimit('postsScheduling', 'maxScheduledPosts') || 0);

// Mock posts data - mirrors GBP API structure
const posts = ref([
  {
    id: 'p101',
    locationId: 'loc1',
    title: 'Promocja Zimowa',
    content: 'Skorzystaj z 20% zniżki na wszystkie usługi! Oferta ważna do końca grudnia.',
    mediaUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
    cta: 'ORDER_ONLINE',
    ctaUrl: 'https://example.com/promocja',
    type: 'OFFER',
    startTime: '2025-11-28T08:00:00Z',
    endTime: '2025-12-31T23:59:00Z',
    scheduledAt: null,
    publishedAt: '2025-11-27T09:01:00Z',
    status: 'published',
    impressions: 512,
    clicks: 45,
    actions: 12
  },
  {
    id: 'p102',
    locationId: 'loc1',
    title: 'Nowe menu sezonowe',
    content: 'Przedstawiamy nowe dania inspirowane jesiennymi smakami. Zapraszamy do degustacji!',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    cta: 'LEARN_MORE',
    ctaUrl: 'https://example.com/menu',
    type: 'UPDATE',
    startTime: null,
    endTime: null,
    scheduledAt: null,
    publishedAt: '2025-11-20T12:00:00Z',
    status: 'published',
    impressions: 328,
    clicks: 28,
    actions: 5
  },
  {
    id: 'p103',
    locationId: 'loc1',
    title: 'Spotkanie z baristą',
    content: 'Zapraszamy na warsztaty parzenia kawy z naszym mistrzem baristą. Liczba miejsc ograniczona!',
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    cta: 'BOOK',
    ctaUrl: 'https://example.com/rezerwacja',
    type: 'EVENT',
    startTime: '2025-12-15T14:00:00Z',
    endTime: '2025-12-15T17:00:00Z',
    scheduledAt: '2025-12-01T09:00:00Z',
    publishedAt: null,
    status: 'planned',
    impressions: null,
    clicks: null,
    actions: null
  },
  {
    id: 'p104',
    locationId: 'loc1',
    title: 'Świąteczna atmosfera',
    content: 'Nasza kawiarnia już gotowa na święta! Zapraszamy po świąteczne smakołyki.',
    mediaUrl: null,
    cta: null,
    ctaUrl: null,
    type: 'UPDATE',
    startTime: null,
    endTime: null,
    scheduledAt: null,
    publishedAt: null,
    status: 'failed',
    impressions: null,
    clicks: null,
    actions: null,
    error: 'Media file too large'
  }
]);

// Form state
const postForm = reactive({
  title: '',
  content: '',
  mediaUrl: '',
  cta: null,
  ctaUrl: '',
  type: 'UPDATE',
  startTime: null,
  endTime: null,
  scheduledAt: null
});

// Options
const statusOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Opublikowane', value: 'published' },
  { label: 'Zaplanowane', value: 'planned' },
  { label: 'Błąd', value: 'failed' }
];

const typeOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Aktualność', value: 'UPDATE' },
  { label: 'Oferta', value: 'OFFER' },
  { label: 'Wydarzenie', value: 'EVENT' }
];

const viewModes = [
  { value: 'table', icon: 'pi pi-list' },
  { value: 'grid', icon: 'pi pi-th-large' }
];

const postTypes = [
  { label: 'Aktualność', value: 'UPDATE' },
  { label: 'Oferta', value: 'OFFER' },
  { label: 'Wydarzenie', value: 'EVENT' }
];

const ctaOptions = [
  { label: 'Brak', value: null },
  { label: 'Dowiedz się więcej', value: 'LEARN_MORE' },
  { label: 'Zamów online', value: 'ORDER_ONLINE' },
  { label: 'Zarezerwuj', value: 'BOOK' },
  { label: 'Zadzwoń', value: 'CALL' },
  { label: 'Zarejestruj się', value: 'SIGN_UP' }
];

// Computed
const statsCards = computed(() => [
  {
    key: 'total',
    label: 'Wszystkie posty',
    value: posts.value.length,
    icon: 'pi-file',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'published',
    label: 'Opublikowane',
    value: posts.value.filter(p => p.status === 'published').length,
    icon: 'pi-check-circle',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'planned',
    label: 'Zaplanowane',
    value: posts.value.filter(p => p.status === 'planned').length,
    icon: 'pi-calendar',
    iconColor: can('postsScheduling') ? 'text-orange-600' : 'text-gray-400',
    bgColor: can('postsScheduling') ? 'bg-orange-50' : 'bg-gray-100',
    subtext: !can('postsScheduling') ? 'Professional' : null
  },
  {
    key: 'impressions',
    label: 'Wyświetlenia',
    value: can('postsAnalytics') ? posts.value.reduce((sum, p) => sum + (p.impressions || 0), 0).toLocaleString() : '—',
    icon: 'pi-eye',
    iconColor: can('postsAnalytics') ? 'text-purple-600' : 'text-gray-400',
    bgColor: can('postsAnalytics') ? 'bg-purple-50' : 'bg-gray-100',
    premium: 'postsAnalytics'
  },
  {
    key: 'limit',
    label: 'Limit miesięczny',
    value: `${postsThisMonth.value}/${maxPostsPerMonth.value}`,
    subtext: 'postów w tym miesiącu',
    icon: 'pi-database',
    iconColor: postsLimitStatus.value?.severity === 'danger' ? 'text-red-600' :
               postsLimitStatus.value?.severity === 'warning' ? 'text-orange-600' : 'text-blue-600',
    bgColor: postsLimitStatus.value?.severity === 'danger' ? 'bg-red-50' :
             postsLimitStatus.value?.severity === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
  }
]);

const filteredPosts = computed(() => {
  let result = [...posts.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.content?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value);
  }

  if (typeFilter.value) {
    result = result.filter(p => p.type === typeFilter.value);
  }

  return result.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.scheduledAt || 0);
    const dateB = new Date(b.publishedAt || b.scheduledAt || 0);
    return dateB - dateA;
  });
});

// Methods
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTypeLabel(type) {
  const labels = { UPDATE: 'Aktualność', OFFER: 'Oferta', EVENT: 'Wydarzenie' };
  return labels[type] || type;
}

function getTypeSeverity(type) {
  const severities = { UPDATE: 'info', OFFER: 'success', EVENT: 'warn' };
  return severities[type] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { published: 'Opublikowany', planned: 'Zaplanowany', failed: 'Błąd', publishing: 'Publikowanie...' };
  return labels[status] || status;
}

function getStatusSeverity(status) {
  const severities = { published: 'success', planned: 'warn', failed: 'danger', publishing: 'info' };
  return severities[status] || 'secondary';
}

function clearFilters() {
  searchQuery.value = '';
  statusFilter.value = null;
  typeFilter.value = null;
}

function openPostDialog(post) {
  editingPost.value = post;
  if (post) {
    Object.assign(postForm, {
      title: post.title || '',
      content: post.content || '',
      mediaUrl: post.mediaUrl || '',
      cta: post.cta,
      ctaUrl: post.ctaUrl || '',
      type: post.type || 'UPDATE',
      startTime: post.startTime ? new Date(post.startTime) : null,
      endTime: post.endTime ? new Date(post.endTime) : null,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null
    });
  } else {
    Object.assign(postForm, {
      title: '',
      content: '',
      mediaUrl: '',
      cta: null,
      ctaUrl: '',
      type: 'UPDATE',
      startTime: null,
      endTime: null,
      scheduledAt: null
    });
  }
  showPostDrawer.value = true;
}

function savePost(publishNow) {
  if (postsThisMonth.value >= maxPostsPerMonth.value && !editingPost.value) {
    toast.add({ severity: 'warn', summary: 'Limit osiągnięty', detail: 'Osiągnięto miesięczny limit postów', life: 3000 });
    return;
  }

  const newPost = {
    id: editingPost.value?.id || `p${Date.now()}`,
    locationId: 'loc1',
    ...postForm,
    startTime: postForm.startTime?.toISOString() || null,
    endTime: postForm.endTime?.toISOString() || null,
    scheduledAt: publishNow ? null : postForm.scheduledAt?.toISOString(),
    publishedAt: publishNow ? new Date().toISOString() : null,
    status: publishNow ? 'published' : 'planned',
    impressions: editingPost.value?.impressions || null,
    clicks: editingPost.value?.clicks || null,
    actions: editingPost.value?.actions || null
  };

  if (editingPost.value) {
    const index = posts.value.findIndex(p => p.id === editingPost.value.id);
    if (index !== -1) {
      posts.value[index] = newPost;
    }
  } else {
    posts.value.unshift(newPost);
  }

  showPostDrawer.value = false;
  toast.add({
    severity: 'success',
    summary: publishNow ? 'Opublikowano' : 'Zaplanowano',
    detail: publishNow ? 'Post został opublikowany' : 'Post został zaplanowany',
    life: 3000
  });
}

function duplicatePost(post) {
  if (postsThisMonth.value >= maxPostsPerMonth.value) {
    toast.add({ severity: 'warn', summary: 'Limit osiągnięty', detail: 'Osiągnięto miesięczny limit postów', life: 3000 });
    return;
  }

  const duplicate = {
    ...post,
    id: `p${Date.now()}`,
    title: `${post.title} (kopia)`,
    status: 'planned',
    publishedAt: null,
    scheduledAt: null,
    impressions: null,
    clicks: null,
    actions: null
  };
  posts.value.unshift(duplicate);
  toast.add({ severity: 'success', summary: 'Zduplikowano', detail: 'Post został skopiowany', life: 3000 });
}

function retryPost(post) {
  post.status = 'publishing';
  setTimeout(() => {
    post.status = 'published';
    post.publishedAt = new Date().toISOString();
    toast.add({ severity: 'success', summary: 'Opublikowano', detail: 'Post został opublikowany', life: 3000 });
  }, 2000);
}

function confirmDeletePost(post) {
  confirm.require({
    message: 'Czy na pewno chcesz usunąć ten post?',
    header: 'Potwierdzenie',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Usuń',
    rejectLabel: 'Anuluj',
    acceptClass: 'p-button-danger',
    accept: () => {
      const index = posts.value.findIndex(p => p.id === post.id);
      if (index !== -1) {
        posts.value.splice(index, 1);
      }
      showPostDrawer.value = false;
      toast.add({ severity: 'info', summary: 'Usunięto', detail: 'Post został usunięty', life: 3000 });
    }
  });
}

function generateAiContent() {
  if (!can('postsAiContent')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Treści AI dostępne w planie Enterprise', life: 3000 });
    return;
  }
  toast.add({ severity: 'info', summary: 'Generowanie AI', detail: 'Tworzenie treści posta...', life: 3000 });
}

function generateAiContentForForm() {
  postForm.content = 'Przykładowa treść wygenerowana przez AI. W rzeczywistej implementacji byłaby to treść stworzona przez model AI na podstawie profilu firmy i aktualnych trendów.';
  toast.add({ severity: 'success', summary: 'AI', detail: 'Treść wygenerowana przez AI', life: 3000 });
}

function navigateToSettings() {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({
    name: 'settings',
    params: { locationId },
    query: { tab: 'business', highlight: 'posts' }
  });
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
