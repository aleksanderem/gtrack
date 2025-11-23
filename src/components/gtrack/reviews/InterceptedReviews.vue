<template>
  <div class="flex flex-col gap-6">
    <Card class="shadow-sm border border-gray-100 flex-1">
        <template #title>
            <div class="flex justify-between items-center">
                <span>Przechwycone opinie</span>
                <Badge :value="feedbacks.length" severity="warning" />
            </div>
        </template>
        <template #content>
           <DataTable :value="feedbacks" paginator :rows="10" size="small" class="text-sm">
              <Column field="date" header="Data">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.date).toLocaleDateString() }}
                </template>
              </Column>
              <Column field="rating" header="Ocena">
                 <template #body="slotProps">
                    <div class="flex text-yellow-500">
                        <i v-for="n in 5" :key="n" class="pi text-xs" :class="n <= slotProps.data.rating ? 'pi-star-fill' : 'pi-star'"></i>
                    </div>
                 </template>
              </Column>
              <Column field="comment" header="Komentarz"></Column>
              <Column header="Akcja">
                 <template #body>
                    <Button icon="pi pi-envelope" text rounded severity="secondary" v-tooltip="'Odpowiedz mailowo'" />
                 </template>
              </Column>
           </DataTable>
        </template>
      </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { ReviewsService } from '../../../services/ReviewsService';

const feedbacks = ref([]);

const loadData = async () => {
    try {
        feedbacks.value = await ReviewsService.getInternalFeedbacks();
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    loadData();
});
</script>
