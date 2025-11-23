<template>
  <div class="flex flex-col gap-4">
    <div class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText v-model="search" placeholder="Szukaj szablonu..." class="w-full" />
    </div>

    <div v-if="loading" class="space-y-2">
        <Skeleton height="3rem" v-for="i in 3" :key="i" />
    </div>

    <div v-else class="flex flex-col gap-2 max-h-96 overflow-y-auto custom-scroll">
      <div 
        v-for="template in filteredTemplates" 
        :key="template.id"
        class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center group"
        @click="selectTemplate(template)"
      >
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-800">{{ template.name }}</span>
                <Tag :severity="template.category === 'positive' ? 'success' : 'danger'" :value="template.category === 'positive' ? 'Pozytywny' : 'Negatywny'" class="text-xs py-0 px-2" />
            </div>
            <p class="text-sm text-gray-500 truncate">{{ template.content }}</p>
        </div>
        <Button icon="pi pi-arrow-right" text rounded severity="secondary" class="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div v-if="filteredTemplates.length === 0" class="text-center text-gray-500 py-4">
        Brak szablonów pasujących do wyszukiwania.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { ReviewsService } from '../../../services/ReviewsService';

const dialogRef = inject('dialogRef');
const templates = ref([]);
const loading = ref(true);
const search = ref('');

const filteredTemplates = computed(() => {
    if (!search.value) return templates.value;
    const s = search.value.toLowerCase();
    return templates.value.filter(t => 
        t.name.toLowerCase().includes(s) || 
        t.content.toLowerCase().includes(s)
    );
});

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
.custom-scroll::-webkit-scrollbar {
    width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.custom-scroll::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
