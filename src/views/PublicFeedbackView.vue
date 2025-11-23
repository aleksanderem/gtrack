<template>
  <div class="bg-surface-50 flex flex-col items-center justify-center font-sans transition-all" :class="[previewMode ? 'min-h-full p-0' : 'min-h-screen p-4']" :style="{ fontFamily: currentSettings.font_family || 'Inter, sans-serif' }">
    
    <div class="w-full max-w-md bg-white shadow-lg overflow-hidden transition-all duration-500" :class="[previewMode ? 'min-h-full rounded-none' : 'rounded-2xl min-h-screen sm:min-h-[initial]']">
        <!-- Header / Logo -->
        <div class="flex flex-col items-center text-center border-b border-surface-100 px-2 py-6 md:p-8" 
             :style="{ borderTop: `6px solid #${currentSettings.theme_color}` }">
            
            <img v-if="currentSettings.logo_url" :src="currentSettings.logo_url" class="h-16 mb-4 object-contain" />
            <div v-else class="h-16 mb-4 flex items-center justify-center bg-surface-100 rounded-full w-16">
                <i class="pi pi-building text-2xl text-surface-400"></i>
            </div>

            <h1 class="text-xl font-bold text-surface-900 mb-2">
                {{ currentSettings.business_name || 'Twoja Firma' }}
            </h1>
            <p class="text-surface-600">
                {{ currentSettings.headline || 'Daj znać jak nam poszło' }}
            </p>
        </div>

        <!-- Content -->
        <div class="px-2 py-6 md:p-8">
            
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-8">
                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>

            <!-- Success State -->
            <div v-else-if="submitted" class="text-center py-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-check text-2xl text-green-600"></i>
                </div>
                <h2 class="text-xl font-bold text-surface-900 mb-2">Dziękujemy!</h2>
                <p class="text-surface-600">Twoja opinia została przekazana do właściciela.</p>
            </div>

            <!-- Rating Input -->
            <div v-else-if="!step" class="flex flex-col items-center py-4">
                <Rating v-model="rating" :cancel="false" class="!gap-3" :pt="{
                    item: ({ context }) => ({
                        class: context.active ? 'text-yellow-400' : 'text-surface-300'
                    }),
                    onIcon: 'text-4xl',
                    offIcon: 'text-4xl'
                }" @change="handleRating" />
                
                <p class="mt-6 text-sm text-surface-500">Kliknij gwiazdkę, aby ocenić</p>
            </div>

            <!-- Negative Feedback Form -->
            <div v-else-if="step === 'form'" class="flex flex-col gap-4 animate-fadein">
                <div class="text-center mb-2">
                    <div class="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium mb-2">
                        <i class="pi pi-star-fill text-xs"></i>
                        <span>{{ rating }} / 5</span>
                    </div>
                    <h3 class="text-lg font-semibold text-surface-900">Powiedz nam co moglibyśmy zrobić lepiej</h3>
                </div>

                <div class="flex flex-col gap-4">
                    <!-- Dynamic Fields -->
                    <template v-for="field in formFields" :key="field.key">
                        <div v-if="field.visible" class="flex flex-col gap-1">
                            <label :for="field.key" class="text-sm font-medium text-surface-700">
                                {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
                            </label>
                            <InputText 
                                :id="field.key" 
                                v-model="formData[field.key]" 
                                :class="{'p-invalid': errors[field.key]}"
                                :placeholder="field.label"
                            />
                            <small v-if="errors[field.key]" class="text-red-500">{{ errors[field.key] }}</small>
                        </div>
                    </template>

                    <!-- Message Field (Always visible) -->
                    <div class="flex flex-col gap-1">
                        <label for="message" class="text-sm font-medium text-surface-700">
                            Twoja opinia <span class="text-red-500">*</span>
                        </label>
                        <Textarea 
                            id="message" 
                            v-model="formData.message" 
                            rows="4" 
                            autoResize 
                            placeholder="Napisz co poszło nie tak..."
                            :class="{'p-invalid': errors.message}"
                        />
                        <small v-if="errors.message" class="text-red-500">{{ errors.message }}</small>
                    </div>
                </div>

                <div class="flex gap-3 mt-4">
                    <Button label="Anuluj" severity="secondary" text class="flex-1" @click="step = null" />
                    <Button label="Wyślij opinię" class="flex-1" :loading="submitting" @click="submitForm" />
                </div>
            </div>

            <!-- Redirecting State -->
            <div v-else-if="step === 'redirect'" class="text-center py-12">
                <i class="pi pi-google text-4xl mb-4 text-blue-500 block"></i>
                <p class="text-lg font-medium text-surface-900 mb-2">Dziękujemy za wysoką ocenę!</p>
                <p class="text-surface-500 mb-6">Przekierowujemy do Google, abyś mógł podzielić się opinią publicznie...</p>
                <i class="pi pi-spin pi-spinner text-2xl text-surface-400"></i>
            </div>

        </div>
    </div>

    <div class="mt-8 text-xs text-surface-400" v-if="!isMobilePreview">
        Powered by GTRACK
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { ReviewsService } from '../services/ReviewsService';

const props = defineProps({
    previewMode: {
        type: Boolean,
        default: false
    },
    previewSettings: {
        type: Object,
        default: null
    }
});

const route = useRoute();
const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);
const step = ref(null); // null (rating), 'form', 'redirect'
const rating = ref(0);
const settings = ref({});
const errors = ref({});

const formData = ref({
    message: ''
});

const isMobilePreview = computed(() => {
    return props.previewMode && props.previewSettings?.device === 'mobile';
});

const currentSettings = computed(() => {
    return props.previewMode && props.previewSettings ? props.previewSettings : settings.value;
});

const formFields = computed(() => {
    return currentSettings.value.form_fields || [];
});

const fetchSettings = async () => {
    if (props.previewMode) {
        loading.value = false;
        return;
    }
    try {
        // Mock fetching by ID
        const data = await ReviewsService.getAcquisitionSettings();
        settings.value = data;
        
        // Initialize form data
        if (data.form_fields) {
            data.form_fields.forEach(f => {
                if (f.visible) formData.value[f.key] = '';
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const handleRating = () => {
    if (!rating.value) return;

    const threshold = currentSettings.value.min_rating_for_google || 4;

    if (rating.value >= threshold) {
        step.value = 'redirect';
        setTimeout(() => {
            if (!props.previewMode) {
                // Real redirect logic
                const placeId = currentSettings.value.google_place_id;
                const url = placeId 
                    ? `https://search.google.com/local/writereview?placeid=${placeId}`
                    : 'https://google.com'; // Fallback
                window.location.href = url;
            } else {
                // Preview mode behavior
                console.log('Redirect prevented in preview mode');
            }
        }, 1500);
    } else {
        step.value = 'form';
    }
};

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    // Validate dynamic fields
    formFields.value.forEach(field => {
        if (field.visible && field.required && !formData.value[field.key]) {
            errors.value[field.key] = 'To pole jest wymagane';
            isValid = false;
        }
    });

    // Validate message
    if (!formData.value.message) {
        errors.value.message = 'Opisz krótko swoje doświadczenie';
        isValid = false;
    }

    return isValid;
};

const submitForm = async () => {
    if (!validateForm()) return;

    submitting.value = true;
    try {
        const feedback = {
            rating: rating.value,
            ...formData.value
        };
        
        if (!props.previewMode) {
            await ReviewsService.saveInternalFeedback(feedback);
        } else {
            await new Promise(r => setTimeout(r, 1000)); // Mock delay
        }
        
        submitted.value = true;
    } catch (e) {
        console.error(e);
    } finally {
        submitting.value = false;
    }
};

// Watch for preview updates
watch(() => props.previewSettings, (newSettings) => {
    if (props.previewMode && newSettings) {
        // Reset state on settings change if needed, or just let it reactive
    }
}, { deep: true });

onMounted(() => {
    fetchSettings();
});
</script>

<style scoped>
@keyframes fadein {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadein {
    animation: fadein 0.3s ease-out forwards;
}
:deep(.p-rating-item .p-rating-icon) {
    font-size: 2.5rem !important;
}
</style>

