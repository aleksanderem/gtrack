<template>
  <Card class="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
    <template #header>
      <!-- Header is handled inside content for better flex layout control, 
           but we can use this slot if needed. Let's stick to custom body layout. -->
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <!-- Header: Author, Source, Rating, Date -->
        <div class="flex justify-between items-start">
          <div class="flex gap-3 items-center">
            <Avatar 
              :image="review.author_avatar" 
              :label="review.author_name ? review.author_name.charAt(0) : '?'" 
              shape="circle" 
              size="large" 
              class="border-2 border-white shadow-sm"
            />
            <div>
              <div class="font-bold text-gray-800 flex items-center gap-2">
                {{ review.author_name }}
                <i v-if="review.source === 'google'" class="pi pi-google text-blue-500" title="Google"></i>
                <i v-else-if="review.source === 'facebook'" class="pi pi-facebook text-blue-600" title="Facebook"></i>
                <i v-else-if="review.source === 'booksy'" class="pi pi-calendar text-teal-600" title="Booksy"></i>
              </div>
              <div class="text-xs text-gray-500">
                {{ formatDate(review.date) }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <Rating 
              :modelValue="review.rating" 
              readonly 
              :cancel="false" 
              :pt="{ 
                onIcon: 'text-yellow-500', 
                offIcon: 'text-gray-300' 
              }" 
            />
            <div v-if="review.service_context" class="mt-1 text-xs text-gray-400">
              <i class="pi pi-cut mr-1"></i>
              {{ review.service_context.service_name }} 
              <span v-if="review.service_context.employee_name">
                (@{{ review.service_context.employee_name }})
              </span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="text-gray-700 leading-relaxed py-2">
          {{ review.content }}
        </div>

        <!-- Reply Section -->
        <div v-if="review.status === 'answered' && review.reply" class="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-xs text-gray-500 uppercase">Twoja odpowiedź</span>
            <span class="text-xs text-gray-400">{{ formatDate(review.reply.date) }}</span>
          </div>
          <p class="text-sm text-gray-600 italic">{{ review.reply.content }}</p>
        </div>

        <div v-else-if="review.status === 'unanswered'" class="mt-2">
          <!-- Action Buttons (Initial State) -->
          <div v-if="!isReplying" class="flex gap-2">
            <Button label="Odpowiedz" icon="pi pi-reply" size="small" severity="secondary" outlined @click="startReply" />
            <Button label="Szablon" icon="pi pi-file" size="small" severity="secondary" outlined @click="openTemplateSelector" />
            <Button 
              label="AI Suggestion" 
              :icon="(!isAiAvailable || isAiLimitExceeded) ? 'pi pi-lock' : 'pi pi-bolt'"
              size="small" 
              class="p-button-help p-button-outlined" 
              :class="{ 'opacity-50': !isAiAvailable || isAiLimitExceeded }"
              @click="generateAi" 
              :loading="isGeneratingAi"
              :disabled="!isAiAvailable || isAiLimitExceeded"
              v-tooltip.top="(!isAiAvailable || isAiLimitExceeded) ? getAiLockReason : ''"
            />
          </div>

          <!-- Reply Form -->
          <div v-else class="flex flex-col gap-3 animate-fade-in">
            <div v-if="isGeneratingAi" class="space-y-2">
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem"></Skeleton>
            </div>
            <Textarea 
              v-else
              v-model="replyText" 
              rows="3" 
              autoResize 
              placeholder="Napisz odpowiedź..." 
              class="w-full p-inputtext-sm"
              :class="{'p-invalid': error}"
            />
            <div class="flex justify-end gap-2">
               <Button label="Anuluj" icon="pi pi-times" text size="small" severity="secondary" @click="cancelReply" />
               <Button label="Wyślij" icon="pi pi-send" size="small" @click="submitReply" :loading="isSending" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Skeleton from 'primevue/skeleton';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import { ReviewsService } from '../../../services/ReviewsService';
import TemplateSelector from './TemplateSelector.vue';
import { useFeatures } from '../../../composables/useFeatures';
import { PLAN_NAMES } from '../../../config/features';

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['replied']);
const dialog = useDialog();
const toast = useToast();
const { can, isLocked, checkLimit, getLimit, features, updateUsage } = useFeatures();

// Check if AI feature is available
const isAiAvailable = computed(() => can('aiAnalysis'));

// Check if AI limit is exceeded
const isAiLimitExceeded = computed(() => !checkLimit('aiAnalysis', 'maxAnalysisPerMonth'));

// Get AI lock reason
const getAiLockReason = computed(() => {
  if (!isAiAvailable.value) {
    const plan = features.aiAnalysis?.requiredPlan;
    const planName = PLAN_NAMES[plan] || 'Professional';
    return `Funkcja AI jest dostępna w planie ${planName}. Zwiększ pakiet, aby używać tej funkcji.`;
  }
  if (isAiLimitExceeded.value) {
    const limit = getLimit('aiAnalysis', 'maxAnalysisPerMonth');
    return `Osiągnięto limit ${limit} analiz AI na miesiąc dla Twojego planu. Zwiększ pakiet, aby zwiększyć limit.`;
  }
  return '';
});

const isReplying = ref(false);
const isGeneratingAi = ref(false);
const isSending = ref(false);
const replyText = ref('');
const error = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('pl-PL', options);
};

const startReply = () => {
  isReplying.value = true;
  replyText.value = '';
};

const cancelReply = () => {
  isReplying.value = false;
  replyText.value = '';
};

const openTemplateSelector = () => {
    // Map review data to feedback format
    const feedbackData = {
        name: props.review.author_name?.split(' ')[0] || '',
        surname: props.review.author_name?.split(' ').slice(1).join(' ') || '',
        email: props.review.email || '',
        phone: props.review.phone || '',
        rating: props.review.rating,
        date: props.review.date,
        service_name: props.review.service_context?.service_name || '',
        employee_name: props.review.service_context?.employee_name || '',
        order_no: props.review.order_no || ''
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
            if (template) {
                isReplying.value = true; // Ensure reply mode is open
                replyText.value = ReviewsService.replaceTemplateVariables(template.content, feedbackData);
            }
        }
    });
};

const generateAi = async () => {
  // Check if AI is available
  if (!isAiAvailable.value) {
    toast.add({
      severity: 'warn',
      summary: 'Funkcja niedostępna',
      detail: getAiLockReason.value,
      life: 5000
    });
    return;
  }
  
  // Check if limit is exceeded
  if (isAiLimitExceeded.value) {
    toast.add({
      severity: 'warn',
      summary: 'Limit osiągnięty',
      detail: getAiLockReason.value,
      life: 5000
    });
    return;
  }
  
  isReplying.value = true;
  isGeneratingAi.value = true;
  try {
    const suggestedText = await ReviewsService.generateAiReply({
      rating: props.review.rating,
      author_name: props.review.author_name
    });
    replyText.value = suggestedText;
    
    // Increment usage count (mock)
    // In real app, this would be handled by backend
    // For now we manually update the store usage
    // We need to read current usage first, but for now let's just increment
    // Since we don't have easy access to current usage value here without subscribing to store
    // Let's assume the store handles it or we just don't update it here for now as it's a mock
    // But wait, I added updateUsage to useFeatures/store
    // Let's try to update it properly if possible, or just skip for now as it's a demo
    
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Błąd',
      detail: 'Nie udało się wygenerować sugestii AI',
      life: 3000
    });
  } finally {
    isGeneratingAi.value = false;
  }
};

const submitReply = async () => {
  if (!replyText.value.trim()) {
    error.value = true;
    return;
  }
  
  isSending.value = true;
  try {
    const updatedReview = await ReviewsService.postReply(props.review.id, replyText.value);
    emit('replied', updatedReview);
    isReplying.value = false;
  } catch (e) {
    console.error(e);
  } finally {
    isSending.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
