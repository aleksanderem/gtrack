<template>
    <Card class="h-full flex flex-col w-full max-w-full border border-gray-200 rounded-lg overflow-hidden">
        <template #content>
            <DataTable v-model:filters="filters" :value="feedbacks" paginator :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" size="normal" class="text-sm flex-1 w-full"
            :globalFilterFields="['name', 'surname', 'email', 'phone', 'comment', 'service_name', 'employee_name', 'order_no']"
            rowHover
            @row-click="onRowClick"
            :pt="{
                headerRow: { class: 'font-normal' },
                column: { headerCell: { class: 'font-normal text-surface-600 bg-surface-50' } },
                bodyRow: { class: '!py-4 cursor-pointer' }
            }">
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
                    <Button icon="pi pi-cog" label="Kolumny" text size="small" class="columns-button" @click="columnsDialogVisible = true" />
                </div>
            </template>
            <template #empty> Nie znaleziono opinii. </template>
            <template #loading> Ładowanie danych... </template>

            <Column field="name" header="Klient" sortable style="min-width: 14rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-3 py-2">
                        <Avatar :label="data.name.charAt(0)" shape="circle" />
                        <div class="flex flex-col">
                            <span class="font-semibold text-sm">{{ data.name }} {{ data.surname }}</span>
                            <span class="text-sm text-surface-500">{{ data.email }}</span>
                        </div>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Szukaj po imieniu" class="p-column-filter text-sm" size="small" />
                </template>
            </Column>

            <Column field="date" header="Data" sortable dataType="date" style="min-width: 10rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="text-sm">{{ formatDate(data.date) }}</span>
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" size="small" :pt="{ input: { class: 'text-sm' } }" />
                </template>
            </Column>

            <Column field="rating" header="Ocena" sortable style="min-width: 10rem" :showFilterMatchModes="false" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <Rating 
                      :modelValue="data.rating" 
                      :readonly="true" 
                      :cancel="false" 
                      class="!gap-1" 
                      :pt="{ 
                        onIcon: '!text-base text-yellow-500', 
                        offIcon: '!text-base text-gray-300' 
                      }" 
                    />
                </template>
                <template #filter="{ filterModel }">
                    <Slider v-model="filterModel.value" range class="m-4" :min="1" :max="5"></Slider>
                    <div class="flex items-center justify-between px-2 text-sm">
                        <span>{{ filterModel.value ? filterModel.value[0] : 1 }}</span>
                        <span>{{ filterModel.value ? filterModel.value[1] : 5 }}</span>
                    </div>
                </template>
            </Column>

            <Column field="status" header="Status" sortable style="min-width: 10rem" :showFilterMatchModes="false" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" class="text-sm font-normal" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="statuses" placeholder="Wybierz status" showClear size="small" :pt="{ root: { class: 'text-sm' } }">
                        <template #option="slotProps">
                            <Tag :value="getStatusLabel(slotProps.option)" :severity="getStatusSeverity(slotProps.option)" class="text-sm font-normal" />
                        </template>
                    </Select>
                </template>
            </Column>

            <!-- Dynamic Optional Columns -->
            <Column v-for="(col, index) of selectedColumns" :key="col.field + '_' + index" :field="col.field" :header="col.header" :sortable="col.sortable" style="min-width: 10rem" :pt="{ headerContent: { class: 'font-normal' } }">
                 <template #body="{ data }">
                    <span class="text-sm">{{ data[col.field] }}</span>
                </template>
                 <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter text-sm" placeholder="Szukaj" size="small" />
                </template>
            </Column>

            <Column field="comment" header="Komentarz" style="min-width: 20rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <p class="text-sm m-0 line-clamp-3 text-surface-600 leading-relaxed">{{ data.comment }}</p>
                </template>
            </Column>

            <Column :exportable="false" style="min-width: 8rem" alignFrozen="right" frozen :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-envelope" text rounded severity="info" class="action-button action-button-info" v-tooltip.top="'Odpowiedz'" size="small" @click.stop="selectedFeedback = data; openReplyDialog()" />
                        <Button icon="pi pi-check-circle" text rounded severity="success" class="action-button action-button-success" v-tooltip.top="'Oznacz jako przeczytane'" size="small" @click.stop="markAsRead(data)" v-if="data.status === 'new'" />
                        <Button icon="pi pi-trash" text rounded severity="danger" class="action-button action-button-danger" v-tooltip.top="'Usuń'" size="small" @click.stop="deleteFeedback(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        </template>
    </Card>

        <Dialog v-model:visible="columnsDialogVisible" header="Wybierz kolumny" :style="{ width: '30rem' }" modal>
            <div class="flex flex-col gap-4">
                <div v-for="col of columns" :key="col.field" class="flex align-items-center gap-2">
                    <Checkbox v-model="selectedColumns" :inputId="col.field" name="column" :value="col" />
                    <label :for="col.field">{{ col.header }}</label>
                </div>
            </div>
            <template #footer>
                <Button label="Zamknij" @click="columnsDialogVisible = false" text />
            </template>
        </Dialog>

        <!-- Reply Dialog -->
        <Dialog v-model:visible="replyDialogVisible" header="Odpowiedz na opinię" :style="{ width: '40rem' }" modal>
            <div class="flex flex-col gap-4">
                <div v-if="selectedFeedback" class="bg-surface-50 p-3 rounded border border-surface-100 mb-2">
                    <span class="text-sm text-surface-500 block mb-1">Komentarz klienta:</span>
                    <p class="text-sm m-0 italic text-surface-600">{{ selectedFeedback.comment }}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <label for="replyMsg" class="font-semibold text-sm">Twoja odpowiedź</label>
                        <Button label="Wstaw szablon" icon="pi pi-plus" size="small" @click="openTemplateSelector" />
                    </div>
                    <TinyEditor 
                        id="replyMsg"
                        v-model="replyMessage" 
                        :mentions="mentionsMap"
                        :editable="true"
                        placeholder="Wpisz treść odpowiedzi... Możesz używać @ aby wstawić zmienne."
                        class="w-full"
                    />
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="pi pi-info-circle text-blue-600 text-sm"></i>
                            <span class="text-sm font-semibold text-blue-700">Dostępne zmienne (wpisz @ aby zobaczyć listę):</span>
                        </div>
                        <div class="flex flex-wrap gap-1">
                            <Button 
                                v-for="variable in availableVariables" 
                                :key="variable.key"
                                :label="`@${variable.key}`" 
                                text 
                                size="small" 
                                severity="secondary"
                                class="text-sm py-1 px-2"
                                @click="insertVariable(variable.key)"
                                v-tooltip.top="variable.description"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Anuluj" @click="replyDialogVisible = false" text severity="secondary" />
                <Button label="Wyślij odpowiedź" icon="pi pi-send" @click="sendReply" :loading="sendingReply" />
            </template>
        </Dialog>

        <!-- Feedback Details Drawer -->
        <Drawer v-model:visible="detailsVisible" header="Szczegóły Opinii" position="right" class="!w-full md:!w-[500px]">
            <template #header>
                <div class="flex justify-between items-center w-full mr-2">
                    <span class="font-semibold text-lg">Szczegóły Opinii</span>
                    <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Usuń" size="small" v-tooltip.bottom="'Usuń opinię'" @click="deleteFeedback(selectedFeedback)" />
                </div>
            </template>
            <div v-if="selectedFeedback" class="flex flex-col gap-6 h-full overflow-hidden">
                <!-- Content Wrapper -->
                <div class="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden px-1">
                    <!-- Header Status -->
                    <div class="flex justify-between items-start border-b border-surface-100 pb-4">
                        <div class="flex flex-col gap-1">
                            <span class="text-sm text-surface-500">Otrzymano: {{ formatDate(selectedFeedback.date) }}</span>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="font-semibold text-base">ID: #{{ selectedFeedback.id }}</span>
                                <Tag :value="getStatusLabel(selectedFeedback.status)" :severity="getStatusSeverity(selectedFeedback.status)" class="text-sm" />
                            </div>
                        </div>
                        <Rating 
                          :modelValue="selectedFeedback.rating" 
                          :readonly="true" 
                          :cancel="false" 
                          class="!gap-1" 
                          :pt="{ 
                            onIcon: '!text-lg text-yellow-500', 
                            offIcon: '!text-lg text-gray-300' 
                          }" 
                        />
                    </div>

                    <!-- Customer Info -->
                    <div class="flex flex-col gap-3">
                        <span class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Klient</span>
                        <div class="flex items-center gap-4 p-3 bg-surface-50 rounded-lg border border-surface-100">
                            <Avatar :label="selectedFeedback.name.charAt(0)" size="large" shape="circle" class="!bg-primary !text-primary-contrast" />
                            <div class="flex flex-col gap-0.5">
                                <span class="font-bold text-sm">{{ selectedFeedback.name }} {{ selectedFeedback.surname }}</span>
                                <span class="text-sm text-surface-600" v-if="selectedFeedback.email"><i class="pi pi-envelope text-sm mr-1"></i>{{ selectedFeedback.email }}</span>
                                <span class="text-sm text-surface-600" v-if="selectedFeedback.phone"><i class="pi pi-phone text-sm mr-1"></i>{{ selectedFeedback.phone }}</span>
                            </div>
                        </div>
                    </div>

                <!-- Feedback Content -->
                <div class="flex flex-col gap-3">
                    <span class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Treść Opinii</span>
                    <div class="p-4 bg-surface-0 border border-surface-200 rounded-lg shadow-sm">
                        <p class="m-0 text-sm text-surface-700 leading-relaxed whitespace-pre-line">
                            {{ selectedFeedback.comment }}
                        </p>
                    </div>
                </div>

                <!-- Reply Content -->
                <div v-if="selectedFeedback.reply" class="flex flex-col gap-3">
                    <span class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Twoja Odpowiedź</span>
                    <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-semibold text-blue-700">{{ selectedFeedback.reply.author || 'Ty' }}</span>
                            <span class="text-[10px] text-blue-500">{{ formatDate(selectedFeedback.reply.date, true) }}</span>
                        </div>
                        <p class="m-0 text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                            {{ selectedFeedback.reply.content }}
                        </p>
                    </div>
                </div>

                <!-- Context Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1 p-3 bg-surface-50 rounded-lg border border-surface-100">
                            <span class="text-[10px] text-surface-500">Usługa</span>
                            <span class="font-medium text-sm">{{ selectedFeedback.service_name || '-' }}</span>
                        </div>
                        <div class="flex flex-col gap-1 p-3 bg-surface-50 rounded-lg border border-surface-100">
                            <span class="text-[10px] text-surface-500">Pracownik</span>
                            <span class="font-medium text-sm">{{ selectedFeedback.employee_name || '-' }}</span>
                        </div>
                        <div class="flex flex-col gap-1 p-3 bg-surface-50 rounded-lg border border-surface-100 col-span-2">
                            <span class="text-[10px] text-surface-500">Nr Zamówienia</span>
                            <span class="font-medium text-sm">{{ selectedFeedback.order_no || '-' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions Footer -->
                <div class="mt-auto pt-6 border-t border-surface-100 bg-white sticky bottom-0">
                    <span class="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3 block">Akcje</span>
                    <div class="flex gap-2">
                        <Button label="Odpowiedz" icon="pi pi-envelope" severity="primary" outlined size="small" class="flex-1 !font-normal" @click="openReplyDialog" />
                        <Button label="Oznacz jako przeczytane" icon="pi pi-check" severity="secondary" outlined size="small" class="flex-1 !font-normal" @click="markAsRead(selectedFeedback)" :disabled="selectedFeedback.status === 'read' || selectedFeedback.status === 'replied'" />
                    </div>
                </div>
            </div>
        </Drawer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { usePrimeVue } from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Rating from 'primevue/rating';
import DatePicker from 'primevue/datepicker';
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import Drawer from 'primevue/drawer';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useDialog } from 'primevue/usedialog';
import TinyEditor from '@juit/vue-tiny-editor';
import '@juit/vue-tiny-editor/style.css';
import TemplateSelector from './TemplateSelector.vue';
import { ReviewsService } from '../../../services/ReviewsService';

const confirm = useConfirm();
const toast = useToast();
const primevue = usePrimeVue();
const dialog = useDialog();

const feedbacks = ref([]);
const loading = ref(true);
const filters = ref();
const columnsDialogVisible = ref(false);
const detailsVisible = ref(false);
const replyDialogVisible = ref(false);
const replyMessage = ref('');
const sendingReply = ref(false);
const selectedFeedback = ref(null);
const columns = ref([
    { field: 'phone', header: 'Telefon', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'order_no', header: 'Nr Zamówienia', sortable: true },
    { field: 'service_name', header: 'Usługa', sortable: true },
    { field: 'employee_name', header: 'Pracownik', sortable: true }
]);
const selectedColumns = ref([]);

const statuses = ['new', 'read', 'replied'];

const getStatusLabel = (status) => {
    switch (status) {
        case 'new': return 'Nowa';
        case 'read': return 'Przeczytana';
        case 'replied': return 'Odpowiedziano';
        default: return status;
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'new': return 'danger';
        case 'read': return 'warn';
        case 'replied': return 'success';
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
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        rating: { value: [1, 5], matchMode: FilterMatchMode.BETWEEN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        order_no: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        employee_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};

const clearFilter = () => {
    initFilters();
};

// Removed onToggle as it's no longer used with direct v-model binding in Dialog

const onRowClick = (event) => {
    selectedFeedback.value = event.data;
    detailsVisible.value = true;
};

const deleteFeedback = (feedback) => {
    confirm.require({
        message: 'Czy na pewno chcesz usunąć tę opinię? Tej operacji nie można cofnąć.',
        header: 'Potwierdzenie usunięcia',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Anuluj',
        acceptLabel: 'Usuń',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await ReviewsService.deleteInternalFeedback(feedback.id);
                feedbacks.value = feedbacks.value.filter(f => f.id !== feedback.id);
                if (selectedFeedback.value && selectedFeedback.value.id === feedback.id) {
                    detailsVisible.value = false;
                    selectedFeedback.value = null;
                }
                toast.add({ severity: 'success', summary: 'Sukces', detail: 'Opinia została usunięta', life: 3000 });
            } catch (e) {
                toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć opinii', life: 3000 });
            }
        }
    });
};

const markAsRead = async (feedback) => {
    try {
        await ReviewsService.updateInternalFeedbackStatus(feedback.id, 'read');
        const index = feedbacks.value.findIndex(f => f.id === feedback.id);
        if (index !== -1) {
            feedbacks.value[index].status = 'read';
        }
        if (selectedFeedback.value && selectedFeedback.value.id === feedback.id) {
            selectedFeedback.value.status = 'read';
        }
        toast.add({ severity: 'success', summary: 'Zaktualizowano', detail: 'Opinia oznaczona jako przeczytana', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zaktualizować statusu', life: 3000 });
    }
};

// Available variables based on feedback structure
const availableVariables = ref([
    { key: 'imie', description: 'Imię klienta' },
    { key: 'nazwisko', description: 'Nazwisko klienta' },
    { key: 'pelne_imie', description: 'Pełne imię (imię + nazwisko)' },
    { key: 'email', description: 'Email klienta' },
    { key: 'telefon', description: 'Numer telefonu' },
    { key: 'ocena', description: 'Ocena (liczba)' },
    { key: 'data', description: 'Data opinii' },
    { key: 'usluga', description: 'Nazwa usługi' },
    { key: 'pracownik', description: 'Imię pracownika' },
    { key: 'zamowienie', description: 'Numer zamówienia' }
]);

const mentionsMap = computed(() => {
    const map = {};
    availableVariables.value.forEach(variable => {
        map[variable.key] = variable.description;
    });
    return map;
});

const insertVariable = (variableKey) => {
    const variableDescription = availableVariables.value.find(v => v.key === variableKey)?.description || variableKey;
    const mentionTag = `<link rel="mention" name="${variableKey}" title="${variableDescription}">@${variableKey}</link>`;
    
    const currentContent = replyMessage.value || '';
    replyMessage.value = currentContent + (currentContent ? ' ' : '') + mentionTag;
};

const openTemplateSelector = () => {
    if (!selectedFeedback.value) return;
    
    const feedbackData = {
        name: selectedFeedback.value.name || '',
        surname: selectedFeedback.value.surname || '',
        email: selectedFeedback.value.email || '',
        phone: selectedFeedback.value.phone || '',
        rating: selectedFeedback.value.rating,
        date: selectedFeedback.value.date,
        service_name: selectedFeedback.value.service_name || '',
        employee_name: selectedFeedback.value.employee_name || '',
        order_no: selectedFeedback.value.order_no || ''
    };
    
    dialog.open(TemplateSelector, {
        props: {
            header: 'Wybierz szablon',
            style: {
                width: '90vw',
                maxWidth: '1200px'
            },
            breakpoints: {
                '960px': '95vw',
                '640px': '98vw'
            },
            modal: true
        },
        data: {
            feedbackData: feedbackData
        },
        onClose: (options) => {
            const template = options.data;
            if (template && selectedFeedback.value) {
                // Replace template variables with actual feedback data
                const replacedContent = ReviewsService.replaceTemplateVariables(template.content, feedbackData);
                // Append to existing content or replace if empty
                replyMessage.value = replyMessage.value 
                    ? replyMessage.value + '\n\n' + replacedContent 
                    : replacedContent;
            }
        }
    });
};

const openReplyDialog = () => {
    replyMessage.value = '';
    replyDialogVisible.value = true;
};

const sendReply = async () => {
    if (!replyMessage.value.trim()) return;
    
    sendingReply.value = true;
    try {
        const updatedFeedback = await ReviewsService.replyToInternalFeedback(selectedFeedback.value.id, replyMessage.value);
        
        // Update list
        const index = feedbacks.value.findIndex(f => f.id === selectedFeedback.value.id);
        if (index !== -1) {
            feedbacks.value[index] = { ...updatedFeedback, date: new Date(updatedFeedback.date) };
        }
        
        // Update selected feedback (for drawer view)
        if (selectedFeedback.value) {
            selectedFeedback.value = { ...updatedFeedback, date: new Date(updatedFeedback.date) };
        }
        
        replyDialogVisible.value = false;
        toast.add({ severity: 'success', summary: 'Wysłano', detail: 'Odpowiedź została wysłana', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się wysłać odpowiedzi', life: 3000 });
    } finally {
        sendingReply.value = false;
    }
};

onMounted(async () => {
    loading.value = true;
    
    // Set Polish translations for filters
    primevue.config.locale.startsWith = 'Zaczyna się od';
    primevue.config.locale.contains = 'Zawiera';
    primevue.config.locale.notContains = 'Nie zawiera';
    primevue.config.locale.endsWith = 'Kończy się na';
    primevue.config.locale.equals = 'Równe';
    primevue.config.locale.notEquals = 'Nie równe';
    primevue.config.locale.noFilter = 'Brak filtra';
    primevue.config.locale.lt = 'Mniejsze niż';
    primevue.config.locale.lte = 'Mniejsze lub równe';
    primevue.config.locale.gt = 'Większe niż';
    primevue.config.locale.gte = 'Większe lub równe';
    primevue.config.locale.dateIs = 'Data to';
    primevue.config.locale.dateIsNot = 'Data to nie';
    primevue.config.locale.dateBefore = 'Data przed';
    primevue.config.locale.dateAfter = 'Data po';
    primevue.config.locale.clear = 'Wyczyść';
    primevue.config.locale.apply = 'Zastosuj';
    primevue.config.locale.matchAll = 'Pasuje do wszystkich';
    primevue.config.locale.matchAny = 'Pasuje do dowolnego';
    primevue.config.locale.addRule = 'Dodaj regułę';
    primevue.config.locale.removeRule = 'Usuń regułę';
    
    try {
        // Convert date strings to Date objects for DatePicker filtering
        const data = await ReviewsService.getInternalFeedbacks();
        feedbacks.value = data.map(d => ({ ...d, date: new Date(d.date) }));
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});

initFilters();
</script>

<style scoped>
/* Make TinyEditor toolbox match the screenshot exactly */
:deep(.-jte-toolbox) {
    margin-top: -10px !important;
    height: auto !important;
    margin-bottom: 0px !important;
    padding: 1rem !important;
    gap: 0.5rem !important;
}

:deep(.-jte-toolbox button),
:deep(.-jte-toolbox .-jte-button) {
    min-width: 3rem !important;
    min-height: 3rem !important;
    width: 3rem !important;
    height: 3rem !important;
    padding: 0.75rem !important;
    font-size: 1.25rem !important;
    margin: 0.25rem !important;
    border-radius: 0.375rem !important;
}

:deep(.-jte-toolbox svg),
:deep(.-jte-toolbox button svg),
:deep(.-jte-toolbox .-jte-button svg),
:deep(.-jte-toolbox .-jte-icon) {
    width: 25px !important;
    height: 25px !important;
    min-width: 25px !important;
    min-height: 25px !important;
}

/* Add padding to TinyEditor content and placeholder - very explicit */
:deep(.-jte-editor[contenteditable="true"]),
:deep(.-jte-editor[contenteditable="plaintext-only"]) {
    padding: 1rem !important;
    padding-top: 1rem !important;
    padding-right: 1rem !important;
    padding-bottom: 1rem !important;
    padding-left: 1rem !important;
    min-height: 150px !important;
}

:deep(.-jte-editor[contenteditable="plaintext-only"]:empty::before),
:deep(.-jte-editor[contenteditable="true"]:empty::before) {
    padding: 1rem !important;
    padding-top: 1rem !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-bottom: 1rem !important;
}

/* Ensure editor content area has padding */
:deep(.-jte-editor) {
    padding: 1rem !important;
}

/* Make sure placeholder inherits padding */
:deep(.-jte-placeholder),
:deep(.juit-tiny-edit .-jte-root .-jte-placeholder) {
    padding: 1rem !important;
    padding-top: 1rem !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-bottom: 1rem !important;
}

/* Force padding on editor content */
:deep(#replyMsg .-jte-editor),
:deep(#replyMsg .-jte-editor[contenteditable="true"]),
:deep(#replyMsg .-jte-editor[contenteditable="plaintext-only"]) {
    padding: 1rem !important;
}

/* DataTable header styles */
:deep(.p-datatable-header) {
    background: #FFF !important;
    border: none !important;
    padding: 0 !important;
    padding-bottom: 0.5rem !important;
}

/* Columns button - always show hover background */
:deep(.columns-button) {
    background-color: #e6f0ff !important;
    color: #3385ff !important;
}

:deep(.columns-button:hover) {
    background-color: #d0e5ff !important;
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
</style>