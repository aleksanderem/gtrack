<template>
    <div class="w-full">
        <div class="mb-6">
            <div class="flex items-center gap-4 mb-2">
                <Button 
                    icon="pi pi-arrow-left" 
                    text 
                    rounded
                    class="back-button"
                    @click="router.back()"
                    v-tooltip.top="'Powrót'"
                />
                <h1 class="text-2xl font-bold text-gray-900">Historia Auto-Odpowiedzi</h1>
            </div>
            <p class="text-gray-500 ml-12">Przeglądaj i zarządzaj automatycznymi odpowiedziami na opinie klientów.</p>
        </div>
        
        <AutoReplyStats v-if="autoReplyStats" :stats="autoReplyStats" />
        <div v-else-if="loadingAutoReplyStats" class="mb-6">
            <Skeleton height="200px" class="rounded-lg"></Skeleton>
        </div>
        
        <div v-if="!loading && history.length === 0" class="text-center py-12 text-gray-500">
            <i class="pi pi-inbox text-4xl mb-4"></i>
            <p>Brak historii auto-odpowiedzi</p>
        </div>
        
        <Card v-if="loading || history.length > 0" class="mb-6">
            <template #content>
                <DataTable 
            v-model:filters="filters" 
            :value="history" 
            paginator 
            :rows="10" 
            dataKey="id" 
            filterDisplay="menu" 
            :loading="loading" 
            size="normal" 
            class="text-sm flex-1 w-full"
            :globalFilterFields="['review_id', 'template_name', 'rule_name']"
            :pt="{
                headerRow: { class: 'font-normal' },
                column: { headerCell: { class: 'font-normal text-surface-600 bg-surface-50' } },
                bodyRow: { class: '!py-4' }
            }"
        >
            <template #header>
                <div class="flex justify-between items-center p-2">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Wyczyść" outlined @click="clearFilter()" size="small" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search text-sm" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Szukaj..." size="small" />
                        </IconField>
                    </div>
                    <div class="flex gap-2">
                        <Button 
                            v-if="pendingCount > 0"
                            :label="`Zatwierdź wszystkie (${pendingCount})`" 
                            icon="pi pi-check" 
                            size="small"
                            @click="approveAllPending"
                            :loading="approvingAll"
                        />
                    </div>
                </div>
            </template>
            <template #empty> Nie znaleziono historii auto-odpowiedzi. </template>
            <template #loading> Ładowanie danych... </template>

            <Column field="review_id" header="ID Opinii" sortable style="min-width: 8rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="font-mono text-sm">#{{ data.review_id }}</span>
                </template>
            </Column>

            <Column field="review_type" header="Typ" sortable style="min-width: 8rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <Tag 
                        :value="data.review_type === 'review' ? 'Opinia' : 'Przechwycona'" 
                        :severity="data.review_type === 'review' ? 'info' : 'secondary'"
                        class="text-sm"
                    />
                </template>
                <template #filter="{ filterModel }">
                    <Select 
                        v-model="filterModel.value" 
                        :options="reviewTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Wybierz typ"
                        showClear
                        size="small"
                    />
                </template>
            </Column>

            <Column field="template_name" header="Szablon" sortable style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="text-sm">{{ data.template_name }}</span>
                </template>
            </Column>

            <Column field="rule_name" header="Reguła" sortable style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="text-sm text-surface-600">{{ data.rule_name }}</span>
                </template>
            </Column>

            <Column field="status" header="Status" sortable style="min-width: 10rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <Tag 
                        :value="getStatusLabel(data.status)" 
                        :severity="getStatusSeverity(data.status)"
                        class="text-sm"
                    />
                </template>
                <template #filter="{ filterModel }">
                    <Select 
                        v-model="filterModel.value" 
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Wybierz status"
                        showClear
                        size="small"
                    />
                </template>
            </Column>

            <Column field="created_at" header="Utworzono" sortable style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="text-sm text-surface-600">{{ formatDate(data.created_at, true) }}</span>
                </template>
            </Column>

            <Column field="sent_at" header="Wysłano" sortable style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span v-if="data.sent_at" class="text-sm text-surface-600">{{ formatDate(data.sent_at, true) }}</span>
                    <span v-else class="text-sm text-surface-400">-</span>
                </template>
            </Column>

            <Column header="Akcje" style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-eye" 
                            text 
                            size="small"
                            class="action-button action-button-info"
                            @click="viewReply(data)"
                            v-tooltip.top="'Podgląd'"
                        />
                        <Button 
                            v-if="data.status === 'pending'"
                            icon="pi pi-check" 
                            text 
                            severity="success"
                            size="small"
                            class="action-button action-button-success"
                            @click="approveReply(data)"
                            v-tooltip.top="'Zatwierdź'"
                        />
                        <Button 
                            v-if="data.status === 'pending'"
                            icon="pi pi-times" 
                            text 
                            severity="danger"
                            size="small"
                            class="action-button action-button-danger"
                            @click="cancelReply(data)"
                            v-tooltip.top="'Anuluj'"
                        />
                        <Button 
                            v-if="data.status === 'failed'"
                            icon="pi pi-refresh" 
                            text 
                            severity="warning"
                            size="small"
                            class="action-button action-button-warning"
                            @click="retryReply(data)"
                            v-tooltip.top="'Spróbuj ponownie'"
                        />
                    </div>
                </template>
            </Column>
                </DataTable>
            </template>
        </Card>

        <!-- Reply Preview Dialog -->
        <Dialog 
            v-model:visible="previewDialogVisible" 
            header="Podgląd Auto-Odpowiedzi"
            :style="{ width: '90vw', maxWidth: '700px' }"
            :modal="true"
        >
            <div v-if="selectedReply" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-semibold text-surface-500 uppercase mb-2">Informacje</span>
                    <div class="border border-surface-200 rounded-lg overflow-hidden">
                        <table class="w-full text-sm">
                            <tbody>
                                <tr class="border-b border-surface-200">
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50 w-1/3">ID Opinii</td>
                                    <td class="px-4 py-3 text-surface-900 font-mono">#{{ selectedReply.review_id }}</td>
                                </tr>
                                <tr class="border-b border-surface-200">
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50">Typ</td>
                                    <td class="px-4 py-3 text-surface-900">{{ selectedReply.review_type === 'review' ? 'Opinia' : 'Przechwycona' }}</td>
                                </tr>
                                <tr class="border-b border-surface-200">
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50">Szablon</td>
                                    <td class="px-4 py-3 text-surface-900">{{ selectedReply.template_name }}</td>
                                </tr>
                                <tr class="border-b border-surface-200">
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50">Reguła</td>
                                    <td class="px-4 py-3 text-surface-900">{{ selectedReply.rule_name }}</td>
                                </tr>
                                <tr class="border-b border-surface-200">
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50">Status</td>
                                    <td class="px-4 py-3">
                                        <Tag :value="getStatusLabel(selectedReply.status)" :severity="getStatusSeverity(selectedReply.status)" class="text-sm" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-3 font-semibold text-surface-600 bg-surface-50">Utworzono</td>
                                    <td class="px-4 py-3 text-surface-900">{{ formatDate(selectedReply.created_at, true) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <span class="text-sm font-semibold text-surface-500 uppercase">Treść odpowiedzi</span>
                    <div class="p-4 bg-surface-50 border border-surface-200 rounded-lg">
                        <div class="text-sm text-surface-700 whitespace-pre-wrap">{{ selectedReply.content }}</div>
                    </div>
                </div>

                <div v-if="selectedReply.error_message" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span class="text-sm font-semibold text-red-700">Błąd:</span>
                    <div class="text-sm text-red-600 mt-1">{{ selectedReply.error_message }}</div>
                </div>

                <div v-if="selectedReply.status === 'pending'" class="flex flex-col gap-3">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Edytuj treść przed wysłaniem</label>
                        <Textarea 
                            v-model="editingContent" 
                            rows="5" 
                            class="w-full"
                            placeholder="Wpisz treść odpowiedzi..."
                        />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Zamknij" text @click="previewDialogVisible = false" />
                <Button 
                    v-if="selectedReply && selectedReply.status === 'pending'"
                    label="Zatwierdź i wyślij" 
                    icon="pi pi-check"
                    @click="approveReplyFromPreview"
                    :loading="approving"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Skeleton from 'primevue/skeleton';
import Card from 'primevue/card';
import AutoReplyStats from './AutoReplyStats.vue';
import { ReviewsService } from '../../../services/ReviewsService';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const history = ref([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  review_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const previewDialogVisible = ref(false);
const selectedReply = ref(null);
const editingContent = ref('');
const approving = ref(false);
const approvingAll = ref(false);
const autoReplyStats = ref(null);
const loadingAutoReplyStats = ref(true);

const reviewTypeOptions = [
  { label: 'Opinia', value: 'review' },
  { label: 'Przechwycona', value: 'feedback' }
];

const statusOptions = [
  { label: 'Oczekuje', value: 'pending' },
  { label: 'Wysłano', value: 'sent' },
  { label: 'Błąd', value: 'failed' },
  { label: 'Anulowano', value: 'cancelled' }
];

const pendingCount = computed(() => {
  return history.value.filter(h => h.status === 'pending').length;
});

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Oczekuje';
    case 'sent': return 'Wysłano';
    case 'failed': return 'Błąd';
    case 'cancelled': return 'Anulowano';
    default: return status;
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'pending': return 'warn';
    case 'sent': return 'success';
    case 'failed': return 'danger';
    case 'cancelled': return 'secondary';
    default: return null;
  }
};

const formatDate = (value, includeTime = false) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(value).toLocaleDateString('pl-PL', options);
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    review_type: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  };
};

const clearFilter = () => {
  initFilters();
};

const loadHistory = async () => {
  loading.value = true;
  try {
    history.value = await ReviewsService.getAutoReplyHistory();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować historii', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadAutoReplyStats = async () => {
  loadingAutoReplyStats.value = true;
  try {
    autoReplyStats.value = await ReviewsService.getAutoReplyStats();
  } catch (e) {
    console.error('Failed to load auto-reply stats', e);
  } finally {
    loadingAutoReplyStats.value = false;
  }
};

const viewReply = (reply) => {
  selectedReply.value = reply;
  editingContent.value = reply.content;
  previewDialogVisible.value = true;
};

const approveReply = async (reply) => {
  approving.value = true;
  try {
    await ReviewsService.approveAutoReply(reply.id, reply.content);
    await loadHistory();
    toast.add({ severity: 'success', summary: 'Zatwierdzono', detail: 'Odpowiedź została wysłana', life: 3000 });
    if (previewDialogVisible.value) {
      previewDialogVisible.value = false;
    }
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zatwierdzić odpowiedzi', life: 3000 });
  } finally {
    approving.value = false;
  }
};

const approveReplyFromPreview = async () => {
  if (!selectedReply.value) return;
  approving.value = true;
  try {
    await ReviewsService.approveAutoReply(selectedReply.value.id, editingContent.value);
    await loadHistory();
    toast.add({ severity: 'success', summary: 'Zatwierdzono', detail: 'Odpowiedź została wysłana', life: 3000 });
    previewDialogVisible.value = false;
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zatwierdzić odpowiedzi', life: 3000 });
  } finally {
    approving.value = false;
  }
};

const cancelReply = async (reply) => {
  confirm.require({
    message: `Czy na pewno chcesz anulować tę auto-odpowiedź?`,
    header: 'Potwierdzenie anulowania',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Anuluj',
    acceptLabel: 'Tak, anuluj',
    accept: async () => {
      try {
        await ReviewsService.cancelAutoReply(reply.id);
        await loadHistory();
        toast.add({ severity: 'success', summary: 'Anulowano', detail: 'Auto-odpowiedź została anulowana', life: 3000 });
      } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się anulować auto-odpowiedzi', life: 3000 });
      }
    }
  });
};

const retryReply = async (reply) => {
  try {
    await ReviewsService.retryFailedReply(reply.id);
    await loadHistory();
    toast.add({ severity: 'success', summary: 'Ponowiono', detail: 'Próba wysłania odpowiedzi została ponowiona', life: 3000 });
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się ponowić wysyłki', life: 3000 });
  }
};

const approveAllPending = async () => {
  const pending = history.value.filter(h => h.status === 'pending');
  if (pending.length === 0) return;
  
  confirm.require({
    message: `Czy na pewno chcesz zatwierdzić wszystkie ${pending.length} oczekujące auto-odpowiedzi?`,
    header: 'Potwierdzenie zatwierdzenia',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Anuluj',
    acceptLabel: 'Tak, zatwierdź wszystkie',
    accept: async () => {
      approvingAll.value = true;
      try {
        for (const reply of pending) {
          try {
            await ReviewsService.approveAutoReply(reply.id, reply.content);
          } catch (e) {
            console.error(`Failed to approve ${reply.id}:`, e);
          }
        }
        await loadHistory();
        toast.add({ severity: 'success', summary: 'Zatwierdzono', detail: `Zatwierdzono ${pending.length} auto-odpowiedzi`, life: 3000 });
      } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zatwierdzić wszystkich odpowiedzi', life: 3000 });
      } finally {
        approvingAll.value = false;
      }
    }
  });
};

onMounted(async () => {
  initFilters();
  await Promise.all([loadHistory(), loadAutoReplyStats()]);
});
</script>

<style scoped>
:deep(.p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0.5rem;
}

:deep(.back-button) {
  background-color: rgba(59, 130, 246, 0.1) !important;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.back-button:hover) {
  background-color: rgba(59, 130, 246, 0.2) !important;
}

:deep(.back-button .p-button-icon) {
  color: rgb(59, 130, 246) !important;
}

/* Action buttons - rounded squares with colored backgrounds */
:deep(.action-button) {
    width: 2rem !important;
    height: 2rem !important;
    padding: 0 !important;
    border-radius: 0.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

:deep(.action-button-info) {
    background-color: #e6f0ff !important;
    color: #3385ff !important;
}

:deep(.action-button-info:hover) {
    background-color: #d0e5ff !important;
}

:deep(.action-button-success) {
    background-color: #e6f0ff !important;
    color: #3385ff !important;
}

:deep(.action-button-success:hover) {
    background-color: #d0e5ff !important;
}

:deep(.action-button-danger) {
    background-color: #fee2e2 !important;
    color: #dc2626 !important;
}

:deep(.action-button-danger:hover) {
    background-color: #fecaca !important;
}

:deep(.action-button-warning) {
    background-color: #fef3c7 !important;
    color: #d97706 !important;
}

:deep(.action-button-warning:hover) {
    background-color: #fde68a !important;
}
</style>

