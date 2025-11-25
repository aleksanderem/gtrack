<template>
  <div 
    v-if="locked" 
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 text-xs font-medium text-purple-700 cursor-pointer hover:from-purple-100 hover:to-indigo-100 transition-all group"
    @click.stop="handleClick"
  >
    <i class="pi pi-lock text-[10px]"></i>
    <span>Od planu {{ planName }}</span>
    <i class="pi pi-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFeatures } from '../../../composables/useFeatures';
import { PLAN_NAMES } from '../../../config/features';

const props = defineProps({
  feature: {
    type: Object,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();
const { isLocked } = useFeatures();

const locked = computed(() => isLocked(props.feature.id));
const planName = computed(() => {
  if (!props.feature.requiredPlan) return '';
  return PLAN_NAMES[props.feature.requiredPlan] || props.feature.requiredPlan;
});

const handleClick = () => {
  if (locked.value) {
    // Navigate to pricing or upgrade modal (mocked for now)
    console.log('Upgrade required for', props.feature.label);
  }
};
</script>





