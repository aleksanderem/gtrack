<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex gap-2">
      <IconField class="flex-1">
        <InputIcon>
          <i class="pi pi-search text-sm" />
        </InputIcon>
        <InputText v-model="search" placeholder="Szukaj szablonu..." class="w-full" size="small" />
      </IconField>
    </div>

    <DataTable 
      v-if="!loading"
      :value="filteredTemplates" 
      :paginator="false"
      :rows="10"
      dataKey="id"
      size="small"
      class="text-sm"
      scrollable
      scrollHeight="flex"
      :pt="{
        headerRow: { class: 'font-normal' },
        bodyRow: { class: 'cursor-pointer' }
      }"
      @row-click="(e) => canUseTemplate(e.data) && selectTemplate(e.data)"
    >
      <Column field="name" header="Nazwa" style="min-width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
        <template #body="{ data }">
          <div class="flex flex-col gap-1">
            <span class="font-semibold text-sm" :class="canUseTemplate(data) ? 'text-surface-900' : 'text-surface-400'">
              {{ data.name }}
            </span>
            <div class="flex flex-wrap gap-1">
              <Tag 
                v-if="canUseTemplate(data)"
                value="Dostępny" 
                severity="success"
                class="text-xs w-fit"
              />
              <Tag 
                v-else-if="data._isWithinLimit === false"
                value="Limit pakietu" 
                severity="warning"
                class="text-xs w-fit"
                v-tooltip.top="`Limit ${getLimit('templates', 'maxTemplates')} szablonów osiągnięty. Zwiększ pakiet, aby używać więcej szablonów.`"
              />
              <Tag 
                v-else
                value="Niedostępny" 
                severity="danger"
                class="text-xs w-fit"
              />
            </div>
          </div>
        </template>
      </Column>

      <Column field="content" header="Treść" style="min-width: 25rem" :pt="{ headerContent: { class: 'font-normal' } }">
        <template #body="{ data }">
          <div class="text-sm text-surface-600 leading-relaxed">
            <TinyEditor 
              :modelValue="data.content || ''"
              :mentions="mentionsMap"
              :editable="false"
              class="w-full"
            />
          </div>
        </template>
      </Column>

      <Column field="variables" header="Analiza zmiennych" style="min-width: 18rem" :pt="{ headerContent: { class: 'font-normal' } }">
        <template #body="{ data }">
          <div class="flex flex-col gap-2">
            <div v-if="getTemplateVariables(data).length === 0" class="text-xs text-surface-500 italic">
              Brak zmiennych w szablonie
            </div>
            <div v-else class="flex flex-col gap-2">
              <div class="flex flex-wrap gap-1">
                <Tag 
                  v-for="varInfo in getVariableAnalysis(data)" 
                  :key="varInfo.name"
                  :value="`@${varInfo.name}`" 
                  :severity="varInfo.available ? 'success' : 'danger'"
                  class="text-xs py-0.5 px-2"
                  v-tooltip.top="varInfo.available ? `${varInfo.description} - dostępna` : `${varInfo.description} - brakuje w danych opinii`"
                />
              </div>
              <div v-if="getMissingVariables(data).length > 0" class="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Brakuje {{ getMissingVariables(data).length }} zmiennej: {{ getMissingVariables(data).map(v => `@${v.name}`).join(', ') }}
              </div>
              <div v-else-if="getTemplateVariables(data).length > 0" class="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1">
                <i class="pi pi-check-circle mr-1"></i>
                Wszystkie zmienne są dostępne
              </div>
            </div>
          </div>
        </template>
      </Column>

      <Column :exportable="false" style="width: 4rem" alignFrozen="right" frozen>
        <template #body="{ data }">
          <Button 
            v-if="canUseTemplate(data)"
            icon="pi pi-plus" 
            severity="secondary" 
            rounded 
            class="action-button action-button-info"
            aria-label="Wybierz szablon"
            @click.stop="selectTemplate(data)"
            v-tooltip.top="'Wybierz szablon'"
          />
          <i v-else class="pi pi-lock text-surface-400"></i>
        </template>
      </Column>

      <template #empty>
        <div class="text-center text-surface-500 py-4">
          Brak szablonów pasujących do wyszukiwania.
        </div>
      </template>
    </DataTable>

    <div v-if="loading" class="space-y-2">
      <Skeleton height="3rem" v-for="i in 5" :key="i" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import TinyEditor from '@juit/vue-tiny-editor';
import '@juit/vue-tiny-editor/style.css';
import { ReviewsService } from '../../../services/ReviewsService';
import { useFeatures } from '../../../composables/useFeatures';

const dialogRef = inject('dialogRef');
const dialogData = inject('dialogData', {});
const templates = ref([]);
const loading = ref(true);
const search = ref('');

const { getLimit } = useFeatures();

// Available variables map
const availableVariables = [
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
];

const mentionsMap = computed(() => {
    const map = {};
    availableVariables.forEach(variable => {
        map[variable.key] = variable.description;
    });
    return map;
});

// Get feedback data from dialog data
const feedbackData = computed(() => dialogData?.feedbackData || {});

const filteredTemplates = computed(() => {
    let result = templates.value;
    
    // Filter only active templates
    result = result.filter(t => t.active === true);
    
    // Sort by ID (or date if available) to ensure consistent ordering
    result = result.sort((a, b) => (a.id || 0) - (b.id || 0));
    
    // Apply package limit - only first N templates are available
    const templateLimit = getLimit('templates', 'maxTemplates');
    if (templateLimit !== null && templateLimit > 0) {
        // Mark templates beyond limit as unavailable
        result = result.map((template, index) => ({
            ...template,
            _isWithinLimit: index < templateLimit
        }));
    } else {
        // No limit - all templates are available
        result = result.map(template => ({
            ...template,
            _isWithinLimit: true
        }));
    }
    
    // Filter by search
    if (search.value) {
        const s = search.value.toLowerCase();
        result = result.filter(t => 
            t.name.toLowerCase().includes(s) || 
            (t.content && t.content.toLowerCase().includes(s))
        );
    }
    
    return result;
});

// Extract variables from template content
const getTemplateVariables = (template) => {
    if (!template || !template.content) return [];
    
    const variables = [];
    const htmlMentionMatches = template.content.match(/<link\s+rel="mention"\s+name="(\w+)"[^>]*>/gi) || [];
    const plainMatches = template.content.match(/@(\w+)/gi) || [];
    
    // Extract from HTML mentions
    htmlMentionMatches.forEach(match => {
        const nameMatch = match.match(/name="(\w+)"/i);
        if (nameMatch) {
            const varName = nameMatch[1].toLowerCase();
            if (!variables.find(v => v === varName)) {
                variables.push(varName);
            }
        }
    });
    
    // Extract from plain @variable format
    plainMatches.forEach(match => {
        const varName = match.substring(1).toLowerCase();
        if (!variables.find(v => v === varName)) {
            variables.push(varName);
        }
    });
    
    return variables;
};

// Get variable analysis for a template
const getVariableAnalysis = (template) => {
    const variables = getTemplateVariables(template);
    const variableMap = {
        'imie': { description: 'Imię klienta', available: !!feedbackData.value?.name },
        'nazwisko': { description: 'Nazwisko klienta', available: !!feedbackData.value?.surname },
        'pelne_imie': { description: 'Pełne imię', available: !!(feedbackData.value?.name || feedbackData.value?.surname) },
        'email': { description: 'Email klienta', available: !!feedbackData.value?.email },
        'telefon': { description: 'Numer telefonu', available: !!feedbackData.value?.phone },
        'ocena': { description: 'Ocena', available: feedbackData.value?.rating !== undefined },
        'data': { description: 'Data opinii', available: !!feedbackData.value?.date },
        'usluga': { description: 'Nazwa usługi', available: !!feedbackData.value?.service_name },
        'pracownik': { description: 'Imię pracownika', available: !!feedbackData.value?.employee_name },
        'zamowienie': { description: 'Numer zamówienia', available: !!feedbackData.value?.order_no }
    };
    
    return variables.map(varName => ({
        name: varName,
        description: variableMap[varName]?.description || varName,
        available: variableMap[varName]?.available || false
    }));
};

// Get missing variables
const getMissingVariables = (template) => {
    return getVariableAnalysis(template).filter(v => !v.available);
};

const canUseTemplate = (template) => {
    // Check if template is within package limit
    if (template._isWithinLimit === false) {
        return false;
    }
    
    if (!feedbackData.value || Object.keys(feedbackData.value).length === 0) {
        return true; // If no feedback data provided, allow all templates within limit
    }
    return ReviewsService.canUseTemplate(template, feedbackData.value);
};

const loadTemplates = async () => {
    loading.value = true;
    try {
        templates.value = await ReviewsService.getTemplates();
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const selectTemplate = (template) => {
    dialogRef.value.close(template);
};

onMounted(() => {
    loadTemplates();
});
</script>

<style scoped>
/* Style for readonly TinyEditor in table */
:deep(.p-datatable .-jte-editor),
:deep(.p-datatable .-jte-editor[contenteditable="false"]) {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    font-size: 0.875rem !important;
    line-height: 1.5rem !important;
    min-height: auto !important;
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
</style>
