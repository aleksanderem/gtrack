<template>
  <div class="p-4 space-y-6">
    
    <!-- Business Profile Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Profil Firmy</h3>
        <Tag :severity="businessProfile.status === 'Otwarte teraz' ? 'success' : 'secondary'" :value="businessProfile.status" />
      </div>

      <!-- Main Info Card -->
      <div class="bg-surface-0 rounded-xl border border-surface-200 p-4 space-y-4">
        <!-- Header -->
        <div class="flex gap-3">
          <Avatar icon="pi pi-building" size="large" shape="square" class="bg-blue-50 text-blue-600 flex-shrink-0" />
          <div class="min-w-0">
             <div class="font-medium text-gray-900 truncate">{{ businessProfile.name }}</div>
             <div class="text-sm text-gray-500 truncate">{{ businessProfile.category }}</div>
          </div>
        </div>
        
        <Divider />

        <!-- Details List -->
        <div class="space-y-3 text-sm">
           <div class="flex items-start gap-3">
             <i class="pi pi-map-marker text-gray-400 mt-1"></i>
             <span class="text-gray-700">{{ businessProfile.address }}</span>
           </div>
           <div class="flex items-center gap-3">
             <i class="pi pi-phone text-gray-400"></i>
             <a :href="'tel:' + businessProfile.phone" class="text-gray-700 hover:text-blue-600">{{ businessProfile.phone }}</a>
           </div>
           <div class="flex items-center gap-3">
             <i class="pi pi-globe text-gray-400"></i>
             <a :href="businessProfile.website" target="_blank" class="text-blue-600 hover:underline truncate">{{ businessProfile.website }}</a>
           </div>
        </div>

        <!-- Rating -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg">
              <span class="font-bold text-gray-900">{{ businessProfile.rating }}</span>
              <div class="flex text-yellow-400 text-xs gap-0.5">
                  <i v-for="n in 5" :key="n" class="pi" :class="n <= Math.round(businessProfile.rating) ? 'pi-star-fill' : 'pi-star'"></i>
              </div>
              <span class="text-xs text-gray-600">({{ businessProfile.reviewCount }} opinii)</span>
          </div>
          <Button label="Przejdź do opinii" icon="pi pi-arrow-right" iconPos="right" size="small" link class="!p-0 !text-sm" />
        </div>
      </div>
    </div>

    <!-- Keywords Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">Słowa Kluczowe</h3>
            <Badge :value="keywords.length" severity="secondary" />
         </div>
         <Button label="Edytuj" icon="pi pi-pencil" size="small" link class="!p-0" />
      </div>
      
      <div class="flex flex-wrap gap-2">
        <Chip 
            v-for="keyword in keywords" 
            :key="keyword" 
            :label="keyword" 
            class="!bg-white !border !border-surface-200 !text-gray-700 !text-sm"
        />
        <div v-if="keywords.length === 0" class="text-sm text-gray-500 italic w-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            Brak zdefiniowanych słów kluczowych
        </div>
      </div>
    </div>

    <!-- Additional Attributes -->
    <div class="space-y-3">
        <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">Udogodnienia</h3>
        </div>
        <div class="flex flex-col gap-2">
            <div v-for="attr in businessProfile.attributes" :key="attr" class="flex items-center gap-2 text-sm text-gray-600 pl-[2px]">
                <i class="pi pi-check-circle text-green-500 flex-shrink-0" style="width: 1rem; text-align: center;"></i>
                <span>{{ attr }}</span>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'
import Badge from 'primevue/badge'
import Button from 'primevue/button'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  },
  keywords: {
    type: Array,
    default: () => []
  }
})

// Mock business profile data (in a real app, this would come from props or store)
// Using the same structure as in BusinessSettings.vue
const businessProfile = computed(() => ({
  name: props.location.name || 'Dublin House Painters',
  category: 'Usługi malarskie',
  address: props.location.address || '123 O\'Connell Street, Dublin, Ireland',
  phone: props.location.phone || '+353 1 234 5678',
  website: 'https://dublinpainters.ie',
  rating: 4.8,
  reviewCount: 124,
  status: props.location.status === 'Active' ? 'Otwarte teraz' : 'Zamknięte',
  attributes: ['Dostępne dla wózków', 'Parking', 'Wi-Fi dla klientów', 'Płatność kartą']
}))
</script>

<style scoped>
/* Scoped styles if needed, currently using utility classes */
</style>
