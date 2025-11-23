<template>
  <div class="flex flex-col gap-6">
    <ReviewsStats v-if="stats" :stats="stats" />
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
        <Skeleton height="150px" class="rounded-lg"></Skeleton>
    </div>

    <ReviewsList />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Skeleton from 'primevue/skeleton';
import ReviewsStats from './ReviewsStats.vue';
import ReviewsList from './ReviewsList.vue';

defineProps({
  stats: {
    type: Object,
    default: null
  }
});
</script>

