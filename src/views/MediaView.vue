<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Media</h1>
          <p class="text-sm text-gray-500 mt-1">Zarządzaj zdjęciami i wideo Google Business Profile</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Snapshot button - gated by mediaSnapshots (Professional) -->
          <Button
            v-if="can('mediaSnapshots')"
            label="Snapshot now"
            icon="pi pi-camera"
            severity="secondary"
            outlined
            @click="createSnapshot"
          />
          <Button
            v-else
            label="Snapshot now"
            icon="pi pi-lock"
            severity="secondary"
            outlined
            disabled
            v-tooltip.bottom="'Snapshoty dostępne w planie Professional'"
          />

          <!-- Add media button - disabled when at limit -->
          <Button
            label="Dodaj media"
            icon="pi pi-plus"
            :disabled="photosThisMonth >= maxPhotosPerMonth"
            @click="showUploadDialog = true"
            v-tooltip.bottom="photosThisMonth >= maxPhotosPerMonth ? 'Osiągnięto limit mediów' : ''"
          />
        </div>
      </div>

      <!-- Limit Warning Banner -->
      <LimitWarningBanner
        v-if="mediaLimitStatus && mediaLimitStatus.percentage >= 75"
        :status="mediaLimitStatus"
        @upgrade="navigateToSettings"
      />

      <!-- Stats Cards -->
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
      <div v-if="!can('mediaSnapshots') || !can('mediaBulkUpload')"
           class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-images text-blue-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-1">Rozszerzone zarządzanie mediami</h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p v-if="!can('mediaSnapshots')">
                <i class="pi pi-camera mr-1" /><strong>Snapshoty</strong> (Professional) - Automatyczne monitorowanie zmian w galerii
              </p>
              <p v-if="!can('mediaBulkUpload')">
                <i class="pi pi-upload mr-1" /><strong>Bulk upload</strong> (Professional) - Masowe przesyłanie mediów
              </p>
              <p>
                <i class="pi pi-database mr-1" />Aktualny limit: <strong>{{ maxPhotosPerMonth }}</strong> mediów/miesiąc
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
            <MultiSelect
              v-model="categoryFilter"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Kategoria"
              class="w-48"
              display="chip"
            />
            <Select
              v-model="typeFilter"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Typ"
              class="w-32"
            />
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Status"
              class="w-36"
            />
          </div>
          <div class="flex items-center gap-2">
            <Button
              v-if="selectedMedia.length > 0"
              :label="`Zaznaczono (${selectedMedia.length})`"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              @click="confirmBulkDelete"
            />
            <SelectButton v-model="viewMode" :options="viewModes" optionLabel="icon" optionValue="value">
              <template #option="{ option }">
                <i :class="option.icon" />
              </template>
            </SelectButton>
          </div>
        </div>
      </div>

      <!-- Bulk Selection Bar -->
      <Transition name="fade">
        <div
          v-if="selectedMedia.length > 0"
          class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <Checkbox v-model="selectAll" binary @change="toggleSelectAll" />
            <span class="text-sm font-medium text-blue-800">
              {{ selectedMedia.length }} z {{ filteredMedia.length }} zaznaczonych
            </span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Bulk category - gated by mediaBulkUpload -->
            <Button
              v-if="can('mediaBulkUpload')"
              label="Zmień kategorię"
              icon="pi pi-tag"
              severity="secondary"
              size="small"
              @click="showBulkCategoryDialog = true"
            />
            <Button
              v-else
              label="Zmień kategorię"
              icon="pi pi-lock"
              severity="secondary"
              size="small"
              disabled
              v-tooltip="'Dostępne w Professional'"
            />
            <Button
              label="Pobierz"
              icon="pi pi-download"
              severity="secondary"
              size="small"
              @click="downloadSelected"
            />
            <Button
              label="Usuń"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              @click="confirmBulkDelete"
            />
          </div>
        </div>
      </Transition>

      <!-- Gallery Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          class="group relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          @click="openMediaDetails(media)"
        >
          <!-- Checkbox -->
          <div
            class="absolute top-2 left-2 z-10"
            @click.stop
          >
            <Checkbox
              v-model="selectedMedia"
              :value="media.id"
              class="bg-white/80 rounded"
            />
          </div>

          <!-- Category Badge -->
          <div class="absolute top-2 right-2 z-10">
            <Tag
              :value="getCategoryLabel(media.category)"
              :severity="getCategorySeverity(media.category)"
              class="text-xs"
            />
          </div>

          <!-- Media Thumbnail -->
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              v-if="media.mediaType === 'PHOTO'"
              :src="media.url"
              :alt="media.category"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
              <i class="pi pi-video text-4xl text-white" />
            </div>

            <!-- Type Icon -->
            <div class="absolute bottom-2 left-2">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/50 text-white"
              >
                <i :class="['pi', media.mediaType === 'PHOTO' ? 'pi-image' : 'pi-video', 'text-xs']" />
              </span>
            </div>

            <!-- Status Badge -->
            <div v-if="media.status !== 'LIVE'" class="absolute bottom-2 right-2">
              <Tag
                :value="getStatusLabel(media.status)"
                :severity="getStatusSeverity(media.status)"
                class="text-xs"
              />
            </div>
          </div>

          <!-- Hover Actions -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          >
            <Button
              icon="pi pi-eye"
              severity="secondary"
              rounded
              @click.stop="openMediaDetails(media)"
            />
            <Button
              icon="pi pi-download"
              severity="secondary"
              rounded
              @click.stop="downloadMedia(media)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              @click.stop="confirmDeleteMedia(media)"
            />
          </div>
        </div>

        <!-- Add Media Card -->
        <div
          class="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
          :class="photosThisMonth >= maxPhotosPerMonth ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-blue-300'"
          @click="photosThisMonth < maxPhotosPerMonth && (showUploadDialog = true)"
        >
          <i :class="['text-2xl mb-2', photosThisMonth >= maxPhotosPerMonth ? 'pi pi-lock text-gray-300' : 'pi pi-plus text-gray-400']" />
          <span class="text-sm text-gray-500">
            {{ photosThisMonth >= maxPhotosPerMonth ? 'Limit osiągnięty' : 'Dodaj media' }}
          </span>
          <span v-if="photosThisMonth >= maxPhotosPerMonth" class="text-xs text-gray-400 mt-1">
            {{ photosThisMonth }}/{{ maxPhotosPerMonth }}
          </span>
        </div>
      </div>

      <!-- List View -->
      <Card v-else class="border-0 shadow-sm">
        <template #content>
          <DataTable
            v-model:selection="selectedMedia"
            :value="filteredMedia"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
            dataKey="id"
            :loading="isLoading"
            stripedRows
            rowHover
            @row-click="(e) => openMediaDetails(e.data)"
            class="cursor-pointer"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            <Column field="url" header="Podgląd" style="width: 100px">
              <template #body="{ data }">
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    v-if="data.mediaType === 'PHOTO'"
                    :src="data.url"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
                    <i class="pi pi-video text-white" />
                  </div>
                </div>
              </template>
            </Column>
            <Column field="category" header="Kategoria" sortable style="width: 130px">
              <template #body="{ data }">
                <Tag :value="getCategoryLabel(data.category)" :severity="getCategorySeverity(data.category)" />
              </template>
            </Column>
            <Column field="mediaType" header="Typ" sortable style="width: 100px">
              <template #body="{ data }">
                <span class="flex items-center gap-2">
                  <i :class="['pi', data.mediaType === 'PHOTO' ? 'pi-image' : 'pi-video']" />
                  {{ data.mediaType === 'PHOTO' ? 'Zdjęcie' : 'Wideo' }}
                </span>
              </template>
            </Column>
            <Column field="metadata.width" header="Wymiary" style="width: 120px">
              <template #body="{ data }">
                {{ data.metadata?.width }}x{{ data.metadata?.height }}
              </template>
            </Column>
            <Column field="metadata.sizeBytes" header="Rozmiar" sortable style="width: 100px">
              <template #body="{ data }">
                {{ formatSize(data.metadata?.sizeBytes) }}
              </template>
            </Column>
            <Column field="createdAt" header="Dodano" sortable style="width: 130px">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>
            <Column field="status" header="Status" sortable style="width: 120px">
              <template #body="{ data }">
                <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
              </template>
            </Column>
            <Column header="Akcje" style="width: 120px">
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <Button
                    icon="pi pi-eye"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="openMediaDetails(data)"
                  />
                  <Button
                    icon="pi pi-download"
                    severity="secondary"
                    text
                    size="small"
                    @click.stop="downloadMedia(data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    size="small"
                    @click.stop="confirmDeleteMedia(data)"
                  />
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-images text-4xl text-gray-300 mb-2" />
                <p class="text-gray-500">Brak mediów</p>
                <Button
                  label="Dodaj media"
                  icon="pi pi-plus"
                  class="mt-3"
                  @click="showUploadDialog = true"
                  :disabled="photosThisMonth >= maxPhotosPerMonth"
                />
              </div>
            </template>
          </DataTable>
        </template>
      </Card>

      <!-- Snapshots Panel - gated by mediaSnapshots -->
      <Card class="border-0 shadow-sm">
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-history text-gray-400" />
              <span>Historia snapshotów</span>
              <i v-if="!can('mediaSnapshots')" class="pi pi-lock text-xs text-gray-400" />
            </div>
            <Tag v-if="!can('mediaSnapshots')" value="Professional" severity="info" class="text-xs" />
          </div>
        </template>
        <template #content>
          <!-- Feature locked state -->
          <div v-if="!can('mediaSnapshots')" class="text-center py-8">
            <i class="pi pi-camera text-4xl text-gray-300 mb-4" />
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Snapshoty mediów</h3>
            <p class="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Automatyczne monitorowanie zmian w galerii zdjęć i wideo. Wykrywaj usunięte lub zmodyfikowane media i reaguj na nieautoryzowane zmiany.
            </p>
            <Button
              label="Odblokuj snapshoty"
              icon="pi pi-arrow-right"
              @click="navigateToSettings"
            />
          </div>

          <!-- Full access content -->
          <div v-else class="space-y-3">
            <div
              v-for="snapshot in snapshots"
              :key="snapshot.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              @click="viewSnapshot(snapshot)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-camera text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ formatDate(snapshot.fetchedAt) }}</p>
                  <p class="text-sm text-gray-500">{{ snapshot.mediaItems.length }} mediów</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Tag
                  v-if="snapshot.changes?.added > 0"
                  :value="`+${snapshot.changes.added}`"
                  severity="success"
                  class="text-xs"
                />
                <Tag
                  v-if="snapshot.changes?.deleted > 0"
                  :value="`-${snapshot.changes.deleted}`"
                  severity="danger"
                  class="text-xs"
                />
                <Tag
                  v-if="snapshot.changes?.modified > 0"
                  :value="`~${snapshot.changes.modified}`"
                  severity="warn"
                  class="text-xs"
                />
                <i class="pi pi-chevron-right text-gray-400" />
              </div>
            </div>

            <div v-if="snapshots.length === 0" class="text-center py-6 text-gray-500">
              <i class="pi pi-camera text-2xl text-gray-300 mb-2" />
              <p>Brak snapshotów. Kliknij "Snapshot now" aby utworzyć pierwszy.</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Media Details Drawer -->
    <Drawer
      v-model:visible="showDetailsDrawer"
      position="right"
      :style="{ width: '500px' }"
      :header="selectedMediaItem?.category || 'Szczegóły'"
    >
      <div v-if="selectedMediaItem" class="space-y-6">
        <!-- Preview -->
        <div class="rounded-xl overflow-hidden bg-gray-100">
          <img
            v-if="selectedMediaItem.mediaType === 'PHOTO'"
            :src="selectedMediaItem.url"
            class="w-full h-auto"
          />
          <div v-else class="aspect-video flex items-center justify-center bg-gray-800">
            <i class="pi pi-video text-6xl text-white" />
          </div>
        </div>

        <!-- Info -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Kategoria</span>
            <Select
              v-model="selectedMediaItem.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              class="w-40"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Typ</span>
            <span class="font-medium">{{ selectedMediaItem.mediaType === 'PHOTO' ? 'Zdjęcie' : 'Wideo' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Wymiary</span>
            <span class="font-medium">{{ selectedMediaItem.metadata?.width }}x{{ selectedMediaItem.metadata?.height }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Rozmiar</span>
            <span class="font-medium">{{ formatSize(selectedMediaItem.metadata?.sizeBytes) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Dodano</span>
            <span class="font-medium">{{ formatDate(selectedMediaItem.createdAt) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Status</span>
            <Tag :value="getStatusLabel(selectedMediaItem.status)" :severity="getStatusSeverity(selectedMediaItem.status)" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">ID</span>
            <span class="font-mono text-xs text-gray-600">{{ selectedMediaItem.id }}</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-2">
          <Button
            v-if="selectedMediaItem.category !== 'COVER'"
            label="Ustaw jako cover"
            icon="pi pi-star"
            class="w-full"
            severity="secondary"
            outlined
            @click="setAsCover(selectedMediaItem)"
          />
          <Button
            v-if="selectedMediaItem.category !== 'LOGO'"
            label="Ustaw jako logo"
            icon="pi pi-id-card"
            class="w-full"
            severity="secondary"
            outlined
            @click="setAsLogo(selectedMediaItem)"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t">
          <Button
            label="Pobierz"
            icon="pi pi-download"
            class="flex-1"
            severity="secondary"
            @click="downloadMedia(selectedMediaItem)"
          />
          <Button
            label="Usuń"
            icon="pi pi-trash"
            class="flex-1"
            severity="danger"
            @click="confirmDeleteMedia(selectedMediaItem)"
          />
        </div>
      </div>
    </Drawer>

    <!-- Upload Dialog -->
    <Dialog
      v-model:visible="showUploadDialog"
      header="Dodaj media"
      modal
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <!-- Limit info -->
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Wykorzystany limit:</span>
            <span :class="mediaLimitStatus?.severity === 'danger' ? 'text-red-600 font-semibold' : 'text-gray-900 font-medium'">
              {{ photosThisMonth }} / {{ maxPhotosPerMonth }} mediów w tym miesiącu
            </span>
          </div>
          <ProgressBar
            :value="(photosThisMonth / maxPhotosPerMonth) * 100"
            :showValue="false"
            class="h-2 mt-2"
            :pt="{
              value: { class: mediaLimitStatus?.severity === 'danger' ? 'bg-red-500' : mediaLimitStatus?.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500' }
            }"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
          <Select
            v-model="uploadForm.category"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Wybierz kategorię"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Typ</label>
          <SelectButton
            v-model="uploadForm.mediaType"
            :options="[{ label: 'Zdjęcie', value: 'PHOTO' }, { label: 'Wideo', value: 'VIDEO' }]"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">URL lub plik</label>
          <InputText v-model="uploadForm.url" class="w-full" placeholder="https://..." />
        </div>

        <div v-if="uploadForm.url" class="rounded-lg overflow-hidden bg-gray-100">
          <img
            v-if="uploadForm.mediaType === 'PHOTO'"
            :src="uploadForm.url"
            class="w-full h-48 object-cover"
            @error="uploadForm.url = ''"
          />
        </div>

        <!-- Bulk upload info for non-premium users -->
        <div v-if="!can('mediaBulkUpload')" class="bg-blue-50 p-3 rounded-lg">
          <div class="flex items-start gap-2">
            <i class="pi pi-info-circle text-blue-600 mt-0.5" />
            <div class="text-sm text-blue-800">
              <strong>Bulk upload</strong> dostępny w planie Professional.
              Przesyłaj wiele plików jednocześnie.
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showUploadDialog = false" />
        <Button
          label="Dodaj"
          icon="pi pi-plus"
          @click="addMedia"
          :disabled="!uploadForm.url || !uploadForm.category || photosThisMonth >= maxPhotosPerMonth"
        />
      </template>
    </Dialog>

    <!-- Bulk Category Dialog -->
    <Dialog
      v-model:visible="showBulkCategoryDialog"
      header="Zmień kategorię"
      modal
      :style="{ width: '400px' }"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nowa kategoria dla {{ selectedMedia.length }} mediów</label>
        <Select
          v-model="bulkCategory"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Wybierz kategorię"
          class="w-full"
        />
      </div>

      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showBulkCategoryDialog = false" />
        <Button label="Zastosuj" icon="pi pi-check" @click="applyBulkCategory" :disabled="!bulkCategory" />
      </template>
    </Dialog>

    <!-- Confirm Dialog -->
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
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
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
const viewMode = ref('grid');
const categoryFilter = ref([]);
const typeFilter = ref(null);
const statusFilter = ref(null);
const selectedMedia = ref([]);
const selectAll = ref(false);
const showDetailsDrawer = ref(false);
const showUploadDialog = ref(false);
const showBulkCategoryDialog = ref(false);
const selectedMediaItem = ref(null);
const bulkCategory = ref(null);

// Feature gating computed properties
const photosThisMonth = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return mediaItems.value.filter(m =>
    new Date(m.createdAt) >= startOfMonth
  ).length;
});
const maxPhotosPerMonth = computed(() => getLimit('media', 'maxPhotosPerMonth') || 20);
const mediaLimitStatus = computed(() =>
  getLimitStatus('media', 'maxPhotosPerMonth', photosThisMonth.value)
);

// Mock media data - mirrors GBP API structure
const mediaItems = ref([
  {
    id: 'media001',
    locationId: 'loc1',
    category: 'COVER',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    metadata: { width: 1920, height: 1080, sizeBytes: 245000 },
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z',
    status: 'LIVE'
  },
  {
    id: 'media002',
    locationId: 'loc1',
    category: 'LOGO',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    metadata: { width: 400, height: 400, sizeBytes: 45000 },
    createdAt: '2025-11-10T08:30:00Z',
    updatedAt: '2025-11-10T08:30:00Z',
    status: 'LIVE'
  },
  {
    id: 'media003',
    locationId: 'loc1',
    category: 'INTERIOR',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    metadata: { width: 1600, height: 1200, sizeBytes: 312000 },
    createdAt: '2025-11-12T14:20:00Z',
    updatedAt: '2025-11-12T14:20:00Z',
    status: 'LIVE'
  },
  {
    id: 'media004',
    locationId: 'loc1',
    category: 'INTERIOR',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
    metadata: { width: 1920, height: 1280, sizeBytes: 289000 },
    createdAt: '2025-11-12T14:22:00Z',
    updatedAt: '2025-11-12T14:22:00Z',
    status: 'LIVE'
  },
  {
    id: 'media005',
    locationId: 'loc1',
    category: 'EXTERIOR',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    metadata: { width: 1800, height: 1200, sizeBytes: 267000 },
    createdAt: '2025-11-08T09:15:00Z',
    updatedAt: '2025-11-08T09:15:00Z',
    status: 'LIVE'
  },
  {
    id: 'media006',
    locationId: 'loc1',
    category: 'PRODUCT',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    metadata: { width: 1200, height: 800, sizeBytes: 178000 },
    createdAt: '2025-11-20T11:00:00Z',
    updatedAt: '2025-11-20T11:00:00Z',
    status: 'LIVE'
  },
  {
    id: 'media007',
    locationId: 'loc1',
    category: 'PRODUCT',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    metadata: { width: 1200, height: 900, sizeBytes: 195000 },
    createdAt: '2025-11-20T11:05:00Z',
    updatedAt: '2025-11-20T11:05:00Z',
    status: 'LIVE'
  },
  {
    id: 'media008',
    locationId: 'loc1',
    category: 'OTHER',
    mediaType: 'VIDEO',
    url: 'https://example.com/video.mp4',
    metadata: { width: 1920, height: 1080, sizeBytes: 15000000 },
    createdAt: '2025-11-25T16:30:00Z',
    updatedAt: '2025-11-25T16:30:00Z',
    status: 'PENDING'
  },
  {
    id: 'media009',
    locationId: 'loc1',
    category: 'INTERIOR',
    mediaType: 'PHOTO',
    url: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800',
    metadata: { width: 1600, height: 1067, sizeBytes: 234000 },
    createdAt: '2025-11-26T09:00:00Z',
    updatedAt: '2025-11-26T09:00:00Z',
    status: 'PENDING'
  }
]);

// Mock snapshots
const snapshots = ref([
  {
    id: 'snap001',
    locationId: 'loc1',
    fetchedAt: '2025-11-27T00:00:00Z',
    mediaItems: [...mediaItems.value],
    changes: { added: 2, deleted: 0, modified: 0 }
  },
  {
    id: 'snap002',
    locationId: 'loc1',
    fetchedAt: '2025-11-26T00:00:00Z',
    mediaItems: mediaItems.value.slice(0, 7),
    changes: { added: 1, deleted: 1, modified: 0 }
  },
  {
    id: 'snap003',
    locationId: 'loc1',
    fetchedAt: '2025-11-25T00:00:00Z',
    mediaItems: mediaItems.value.slice(0, 7),
    changes: { added: 0, deleted: 0, modified: 2 }
  }
]);

// Upload form
const uploadForm = reactive({
  category: null,
  mediaType: 'PHOTO',
  url: ''
});

// Options
const categoryOptions = [
  { label: 'Cover', value: 'COVER' },
  { label: 'Logo', value: 'LOGO' },
  { label: 'Wnętrze', value: 'INTERIOR' },
  { label: 'Zewnętrze', value: 'EXTERIOR' },
  { label: 'Produkt', value: 'PRODUCT' },
  { label: 'Inne', value: 'OTHER' }
];

const typeOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Zdjęcia', value: 'PHOTO' },
  { label: 'Wideo', value: 'VIDEO' }
];

const statusOptions = [
  { label: 'Wszystkie', value: null },
  { label: 'Aktywne', value: 'LIVE' },
  { label: 'Oczekujące', value: 'PENDING' },
  { label: 'Usunięte', value: 'REMOVED' }
];

const viewModes = [
  { value: 'grid', icon: 'pi pi-th-large' },
  { value: 'list', icon: 'pi pi-list' }
];

// Computed
const statsCards = computed(() => [
  {
    key: 'total',
    label: 'Wszystkie',
    value: mediaItems.value.length,
    icon: 'pi-images',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'photos',
    label: 'Zdjęcia',
    value: mediaItems.value.filter(m => m.mediaType === 'PHOTO').length,
    icon: 'pi-image',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'videos',
    label: 'Wideo',
    value: mediaItems.value.filter(m => m.mediaType === 'VIDEO').length,
    icon: 'pi-video',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    key: 'pending',
    label: 'Oczekujące',
    value: mediaItems.value.filter(m => m.status === 'PENDING').length,
    icon: 'pi-clock',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    key: 'thisMonth',
    label: 'W tym miesiącu',
    value: `${photosThisMonth.value}/${maxPhotosPerMonth.value}`,
    subtext: 'limit miesięczny',
    icon: 'pi-database',
    iconColor: mediaLimitStatus.value?.severity === 'danger' ? 'text-red-600' :
               mediaLimitStatus.value?.severity === 'warning' ? 'text-orange-600' : 'text-blue-600',
    bgColor: mediaLimitStatus.value?.severity === 'danger' ? 'bg-red-50' :
             mediaLimitStatus.value?.severity === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
  },
  {
    key: 'size',
    label: 'Rozmiar',
    value: formatSize(mediaItems.value.reduce((sum, m) => sum + (m.metadata?.sizeBytes || 0), 0)),
    icon: 'pi-chart-pie',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
]);

const filteredMedia = computed(() => {
  let result = [...mediaItems.value];

  if (categoryFilter.value.length > 0) {
    result = result.filter(m => categoryFilter.value.includes(m.category));
  }

  if (typeFilter.value) {
    result = result.filter(m => m.mediaType === typeFilter.value);
  }

  if (statusFilter.value) {
    result = result.filter(m => m.status === statusFilter.value);
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getCategoryLabel(category) {
  const labels = {
    COVER: 'Cover',
    LOGO: 'Logo',
    INTERIOR: 'Wnętrze',
    EXTERIOR: 'Zewnętrze',
    PRODUCT: 'Produkt',
    OTHER: 'Inne'
  };
  return labels[category] || category;
}

function getCategorySeverity(category) {
  const severities = {
    COVER: 'info',
    LOGO: 'success',
    INTERIOR: 'warn',
    EXTERIOR: 'secondary',
    PRODUCT: 'contrast',
    OTHER: 'secondary'
  };
  return severities[category] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { LIVE: 'Aktywne', PENDING: 'Oczekujące', REMOVED: 'Usunięte' };
  return labels[status] || status;
}

function getStatusSeverity(status) {
  const severities = { LIVE: 'success', PENDING: 'warn', REMOVED: 'danger' };
  return severities[status] || 'secondary';
}

function clearFilters() {
  categoryFilter.value = [];
  typeFilter.value = null;
  statusFilter.value = null;
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedMedia.value = filteredMedia.value.map(m => m.id);
  } else {
    selectedMedia.value = [];
  }
}

function openMediaDetails(media) {
  selectedMediaItem.value = { ...media };
  showDetailsDrawer.value = true;
}

function downloadMedia(media) {
  window.open(media.url, '_blank');
  toast.add({ severity: 'info', summary: 'Pobieranie', detail: 'Rozpoczęto pobieranie', life: 3000 });
}

function downloadSelected() {
  selectedMedia.value.forEach(id => {
    const media = mediaItems.value.find(m => m.id === id);
    if (media) window.open(media.url, '_blank');
  });
  toast.add({ severity: 'info', summary: 'Pobieranie', detail: `Pobieranie ${selectedMedia.value.length} plików`, life: 3000 });
}

function confirmDeleteMedia(media) {
  confirm.require({
    message: 'Czy na pewno chcesz usunąć to medium?',
    header: 'Potwierdzenie',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Usuń',
    rejectLabel: 'Anuluj',
    acceptClass: 'p-button-danger',
    accept: () => {
      const index = mediaItems.value.findIndex(m => m.id === media.id);
      if (index !== -1) {
        mediaItems.value.splice(index, 1);
      }
      showDetailsDrawer.value = false;
      toast.add({ severity: 'success', summary: 'Usunięto', detail: 'Medium zostało usunięte', life: 3000 });
    }
  });
}

function confirmBulkDelete() {
  confirm.require({
    message: `Czy na pewno chcesz usunąć ${selectedMedia.value.length} mediów?`,
    header: 'Potwierdzenie',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Usuń',
    rejectLabel: 'Anuluj',
    acceptClass: 'p-button-danger',
    accept: () => {
      mediaItems.value = mediaItems.value.filter(m => !selectedMedia.value.includes(m.id));
      selectedMedia.value = [];
      toast.add({ severity: 'success', summary: 'Usunięto', detail: 'Media zostały usunięte', life: 3000 });
    }
  });
}

function setAsCover(media) {
  // Remove cover from previous
  mediaItems.value.forEach(m => {
    if (m.category === 'COVER') m.category = 'OTHER';
  });
  // Set new cover
  const item = mediaItems.value.find(m => m.id === media.id);
  if (item) item.category = 'COVER';
  selectedMediaItem.value.category = 'COVER';
  toast.add({ severity: 'success', summary: 'Zaktualizowano', detail: 'Ustawiono jako cover', life: 3000 });
}

function setAsLogo(media) {
  // Remove logo from previous
  mediaItems.value.forEach(m => {
    if (m.category === 'LOGO') m.category = 'OTHER';
  });
  // Set new logo
  const item = mediaItems.value.find(m => m.id === media.id);
  if (item) item.category = 'LOGO';
  selectedMediaItem.value.category = 'LOGO';
  toast.add({ severity: 'success', summary: 'Zaktualizowano', detail: 'Ustawiono jako logo', life: 3000 });
}

function addMedia() {
  if (photosThisMonth.value >= maxPhotosPerMonth.value) {
    toast.add({ severity: 'warn', summary: 'Limit osiągnięty', detail: 'Osiągnięto miesięczny limit mediów', life: 3000 });
    return;
  }

  const newMedia = {
    id: `media${Date.now()}`,
    locationId: 'loc1',
    category: uploadForm.category,
    mediaType: uploadForm.mediaType,
    url: uploadForm.url,
    metadata: { width: 1920, height: 1080, sizeBytes: 250000 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'PENDING'
  };
  mediaItems.value.unshift(newMedia);
  showUploadDialog.value = false;
  uploadForm.category = null;
  uploadForm.mediaType = 'PHOTO';
  uploadForm.url = '';
  toast.add({ severity: 'success', summary: 'Dodano', detail: 'Medium zostało dodane', life: 3000 });
}

function applyBulkCategory() {
  if (!can('mediaBulkUpload')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Bulk upload wymaga planu Professional', life: 3000 });
    return;
  }

  selectedMedia.value.forEach(id => {
    const item = mediaItems.value.find(m => m.id === id);
    if (item) item.category = bulkCategory.value;
  });
  showBulkCategoryDialog.value = false;
  bulkCategory.value = null;
  toast.add({ severity: 'success', summary: 'Zaktualizowano', detail: `Zmieniono kategorię dla ${selectedMedia.value.length} mediów`, life: 3000 });
  selectedMedia.value = [];
}

function createSnapshot() {
  if (!can('mediaSnapshots')) {
    toast.add({ severity: 'warn', summary: 'Funkcja Premium', detail: 'Snapshoty dostępne w planie Professional', life: 3000 });
    return;
  }

  const newSnapshot = {
    id: `snap${Date.now()}`,
    locationId: 'loc1',
    fetchedAt: new Date().toISOString(),
    mediaItems: [...mediaItems.value],
    changes: { added: 0, deleted: 0, modified: 0 }
  };
  snapshots.value.unshift(newSnapshot);
  toast.add({ severity: 'success', summary: 'Snapshot', detail: 'Utworzono nowy snapshot', life: 3000 });
}

function viewSnapshot(snapshot) {
  toast.add({ severity: 'info', summary: 'Snapshot', detail: `Przeglądanie snapshotu z ${formatDate(snapshot.fetchedAt)}`, life: 3000 });
}

function navigateToSettings() {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({
    name: 'settings',
    params: { locationId },
    query: { tab: 'business', highlight: 'media' }
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
</style>
