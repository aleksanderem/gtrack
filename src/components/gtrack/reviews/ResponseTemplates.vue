<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="text-xl font-semibold text-gray-800">Szablony Odpowiedzi</div>
      <Button label="Nowy szablon" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <div v-if="loading" class="space-y-2">
      <Skeleton height="4rem" v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="templates.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <i class="pi pi-file text-4xl text-gray-300 mb-3"></i>
      <p class="text-gray-500">Brak zdefiniowanych szablonów.</p>
    </div>

    <DataTable v-else :value="templates" stripedRows class="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      <Column field="name" header="Nazwa" sortable></Column>
      <Column field="content" header="Treść">
        <template #body="slotProps">
          <div class="truncate max-w-md text-gray-600">{{ slotProps.data.content }}</div>
        </template>
      </Column>
      <Column field="category" header="Kategoria" sortable>
        <template #body="slotProps">
          <Tag :severity="getCategorySeverity(slotProps.data.category)" :value="getCategoryLabel(slotProps.data.category)" />
        </template>
      </Column>
      <Column header="Akcje" :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" text rounded severity="secondary" @click="openDialog(slotProps.data)" />
          <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:visible="dialogVisible" :header="dialogHeader" :modal="true" class="p-fluid" :style="{ width: '450px' }">
      <div class="flex flex-col gap-4 mt-2">
        <div class="field">
          <label for="name" class="font-semibold mb-1 block">Nazwa szablonu</label>
          <InputText id="name" v-model="currentTemplate.name" required autofocus :class="{'p-invalid': submitted && !currentTemplate.name}" />
          <small class="p-error" v-if="submitted && !currentTemplate.name">Nazwa jest wymagana.</small>
        </div>

        <div class="field">
          <label for="category" class="font-semibold mb-1 block">Kategoria</label>
          <SelectButton v-model="currentTemplate.category" :options="categoryOptions" optionLabel="label" optionValue="value" />
        </div>

        <div class="field">
          <label for="content" class="font-semibold mb-1 block">
            Treść 
            <span class="text-xs font-normal text-gray-500 ml-2">(Użyj <code class="bg-gray-100 px-1 rounded text-purple-600">@{{imie}}</code> jako placeholder)</span>
          </label>
          <Textarea id="content" v-model="currentTemplate.content" required rows="5" autoResize placeholder="Wpisz treść odpowiedzi..." :class="{'p-invalid': submitted && !currentTemplate.content}" />
          <small class="p-error" v-if="submitted && !currentTemplate.content">Treść jest wymagana.</small>
        </div>
      </div>

      <template #footer>
        <Button label="Anuluj" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Zapisz" icon="pi pi-check" @click="saveTemplate" :loading="saving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import SelectButton from 'primevue/selectbutton';
import Skeleton from 'primevue/skeleton';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ReviewsService } from '../../../services/ReviewsService';

const templates = ref([]);
const loading = ref(true);
const saving = ref(false);
const dialogVisible = ref(false);
const submitted = ref(false);
const currentTemplate = ref({});
const confirm = useConfirm();
const toast = useToast();

const categoryOptions = [
  { label: 'Pozytywne', value: 'positive' },
  { label: 'Negatywne', value: 'negative' }
];

const dialogHeader = computed(() => currentTemplate.value.id ? 'Edytuj szablon' : 'Nowy szablon');

const loadTemplates = async () => {
  loading.value = true;
  try {
    templates.value = await ReviewsService.getTemplates();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się pobrać szablonów', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const openDialog = (template) => {
  currentTemplate.value = template ? { ...template } : { name: '', content: '', category: 'positive' };
  submitted.value = false;
  dialogVisible.value = true;
};

const hideDialog = () => {
  dialogVisible.value = false;
  submitted.value = false;
};

const saveTemplate = async () => {
  submitted.value = true;

  if (currentTemplate.value.name.trim() && currentTemplate.value.content.trim()) {
    saving.value = true;
    try {
      await ReviewsService.saveTemplate(currentTemplate.value);
      await loadTemplates(); // Refresh list
      dialogVisible.value = false;
      toast.add({ severity: 'success', summary: 'Sukces', detail: 'Szablon został zapisany', life: 3000 });
    } catch (e) {
      console.error(e);
      toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać szablonu', life: 3000 });
    } finally {
      saving.value = false;
    }
  }
};

const confirmDelete = (template) => {
  confirm.require({
    message: 'Czy na pewno chcesz usunąć ten szablon?',
    header: 'Potwierdzenie',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Tak',
    rejectLabel: 'Nie',
    accept: async () => {
      try {
        await ReviewsService.deleteTemplate(template.id);
        await loadTemplates();
        toast.add({ severity: 'success', summary: 'Sukces', detail: 'Szablon usunięty', life: 3000 });
      } catch (e) {
         toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć szablonu', life: 3000 });
      }
    }
  });
};

const getCategorySeverity = (cat) => {
    return cat === 'positive' ? 'success' : 'danger';
};

const getCategoryLabel = (cat) => {
    return cat === 'positive' ? 'Pozytywna' : 'Negatywna';
};

onMounted(() => {
  loadTemplates();
});
</script>
