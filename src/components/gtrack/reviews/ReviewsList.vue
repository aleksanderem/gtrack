<template>
  <div>
    <!-- Toolbar / Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <SelectButton 
        v-model="activeFilter" 
        :options="filterOptions" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full sm:w-auto"
        @change="refreshReviews"
      />
      
      <div class="flex gap-2 w-full sm:w-auto">
        <Dropdown 
          v-model="sortBy" 
          :options="sortOptions" 
          optionLabel="label" 
          optionValue="value" 
          placeholder="Sortuj" 
          class="w-full sm:w-48"
          @change="refreshReviews"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-4 rounded-lg bg-white shadow-sm">
        <div class="flex gap-4 mb-4">
          <Skeleton shape="circle" size="3rem"></Skeleton>
          <div class="flex-1">
            <Skeleton width="40%" class="mb-2"></Skeleton>
            <Skeleton width="20%"></Skeleton>
          </div>
        </div>
        <Skeleton width="100%" height="4rem"></Skeleton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="reviews.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <i class="pi pi-comments text-4xl text-gray-300 mb-3"></i>
      <p class="text-gray-500">Brak opinii spełniających kryteria.</p>
    </div>

    <!-- Review Feed -->
    <div v-else class="space-y-2">
      <TransitionGroup name="list">
        <ReviewItem 
          v-for="review in reviews" 
          :key="review.id" 
          :review="review" 
          @replied="handleReplyUpdate"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import SelectButton from 'primevue/selectbutton';
import Dropdown from 'primevue/dropdown';
import Skeleton from 'primevue/skeleton';
import ReviewItem from './ReviewItem.vue';
import { ReviewsService } from '../../../services/ReviewsService';

const loading = ref(true);
const reviews = ref([]);
const activeFilter = ref('all');
const sortBy = ref('newest');

const filterOptions = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Do odpowiedzi', value: 'unanswered' },
  { label: 'Odpowiedziane', value: 'answered' }
];

const sortOptions = [
  { label: 'Najnowsze', value: 'newest' },
  { label: 'Najniższa ocena', value: 'lowest' }
];

const fetchReviews = async () => {
  loading.value = true;
  try {
    const data = await ReviewsService.getReviews({
      status: activeFilter.value,
      sort: sortBy.value
    });
    reviews.value = data;
  } catch (error) {
    console.error('Failed to fetch reviews', error);
  } finally {
    loading.value = false;
  }
};

const refreshReviews = () => {
  fetchReviews();
};

const handleReplyUpdate = (updatedReview) => {
  // Update the local state without refetching everything to keep it snappy
  const index = reviews.value.findIndex(r => r.id === updatedReview.id);
  if (index !== -1) {
    reviews.value[index] = updatedReview;
    
    // If we are in 'unanswered' view, remove it from the list with animation
    if (activeFilter.value === 'unanswered') {
      setTimeout(() => {
         reviews.value.splice(index, 1);
      }, 500); // visible update before removal
    }
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
