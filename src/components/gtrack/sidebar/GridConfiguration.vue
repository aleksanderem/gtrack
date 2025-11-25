<template>
  <section class="bg-white rounded-2xl shadow-sm p-6 space-y-8">
    <header class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold text-gray-900">Domyślna konfiguracja siatki</h3>
      <p class="text-sm text-gray-500 max-w-2xl">
        Dostosuj ilość punktów oraz odstępy, aby dopasować pomiar do charakterystyki miasta. 
        Większa siatka daje precyzyjniejszy obraz, mniejsza – szybsze wyniki.
      </p>
    </header>

    <div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 border border-gray-200 rounded-2xl">
      <label
        v-for="option in gridSizeOptions"
        :key="option.value"
        class="flex items-start gap-3 px-4 py-4 transition-colors flex-1 relative"
        :class="[
          modelGridSize === option.value
            ? 'bg-blue-50/70 border-l-4 border-blue-400'
            : option.locked
            ? 'bg-gray-50 opacity-60 cursor-not-allowed'
            : 'hover:bg-gray-50 cursor-pointer'
        ]"
      >
        <RadioButton 
          v-model="modelGridSize" 
          :value="option.value" 
          :disabled="option.locked"
          name="grid-size" 
        />
        <div class="flex flex-col gap-1 flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-gray-900 font-semibold leading-tight">
              {{ option.title }}
            </span>
          </div>
          <span class="text-sm leading-tight" :class="option.locked ? 'text-gray-400' : 'text-gray-500'">
            {{ option.description }}
          </span>
          <span 
            v-if="option.locked" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
            style="top: -10px; position: absolute !important; bottom: auto; left: 50%; right: auto; transform: translateX(-50%);"
          >
            <i class="pi pi-lock text-[10px]"></i>
            {{ option.requiredPlan }}
          </span>
        </div>
      </label>
    </div>

    <div class="space-y-4">
      <header>
        <h4 class="text-sm font-semibold text-gray-900">
          Odstęp między punktami
        </h4>
        <p class="text-xs text-gray-500">
          Aktualnie: <strong>{{ modelStepKm * 1000 }}m</strong>
          <span v-if="minStepKm < 2" class="text-orange-600">
            (max. {{ minStepKm * 1000 }}m dla {{ currentPlanName }})
          </span>
        </p>
      </header>
      
      <!-- Discrete step options as radio buttons -->
      <div class="flex flex-col gap-2">
        <label
          v-for="option in stepOptions"
          :key="option.meters"
          class="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all relative"
          :class="[
            modelStepKm === option.km
              ? 'bg-blue-50 border-blue-400 cursor-pointer'
              : option.locked
              ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
              : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
          ]"
        >
          <RadioButton 
            v-model="modelStepKm" 
            :value="option.km" 
            :disabled="option.locked"
            name="step-size"
          />
          <div class="flex-1 flex items-center justify-between min-w-0">
            <span class="font-medium text-sm" :class="option.locked ? 'text-gray-400' : 'text-gray-900'">
              {{ option.meters }}m
            </span>
            <span class="text-xs text-gray-500">{{ option.description }}</span>
          </div>
          <span 
            v-if="option.locked" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
          >
            <i class="pi pi-lock text-[10px]"></i>
            {{ option.requiredPlan }}
          </span>
        </label>
      </div>
    </div>

    <div class="space-y-4">
      <header>
        <h4 class="text-sm font-semibold text-gray-900">
          Punkt centralny skanowania
        </h4>
      </header>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-map-marker"></i>
        </InputGroupAddon>
        <InputText 
          v-model="modelCenterName" 
          placeholder="np. Dublin, Ireland" 
          @keydown.enter="handleSearch"
        />
        <Button label="Znajdź" icon="pi pi-search" @click="handleSearch" />
      </InputGroup>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <h5 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <i class="pi pi-info-circle text-gray-500"></i>
        Podsumowanie aktualnych ustawień
      </h5>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <dt class="font-medium text-gray-900">Siatka</dt>
          <dd>{{ modelGridSize }}×{{ modelGridSize }} ({{ modelGridSize * modelGridSize }} punktów)</dd>
        </div>
        <div>
          <dt class="font-medium text-gray-900">Odstęp</dt>
          <dd>{{ modelStepKm * 1000 }} m</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Slider from 'primevue/slider'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useFeatures } from '../../../composables/useFeatures'
import { PLAN_NAMES } from '../../../config/features'

const { getLimit, isLocked, currentPlanLevel, currentPlan } = useFeatures()

// Current plan name for display
const currentPlanName = computed(() => PLAN_NAMES[currentPlan.value] || 'Basic')

const props = defineProps({
  gridSize: {
    type: Number,
    default: 9
  },
  stepKm: {
    type: Number,
    default: 1
  },
  centerName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:gridSize', 'update:stepKm', 'update:centerName', 'search-location'])

// Get maximum step in km from plan limits
const minStepKm = computed(() => {
  const maxMeters = getLimit('keywordGridSettings', 'maxStepMeters')
  return maxMeters ? maxMeters / 1000 : 2.0 // Convert to km
})

const modelGridSize = computed({
  get: () => props.gridSize,
  set: (value) => {
    // Only allow setting if not locked
    if (!isGridOptionLocked(value)) {
      emit('update:gridSize', value)
    }
  }
})

const modelStepKm = computed({
  get: () => {
    // Enforce maximum step
    return Math.min(props.stepKm, minStepKm.value)
  },
  set: (value) => {
    // Enforce maximum step when setting
    const validValue = Math.min(value, minStepKm.value)
    if (!isStepLocked(validValue)) {
      emit('update:stepKm', validValue)
    }
  }
})

const modelCenterName = computed({
  get: () => props.centerName,
  set: (value) => emit('update:centerName', value)
})

const handleSearch = () => {
  emit('search-location', modelCenterName.value)
}

// Check if grid option is locked based on plan limits
const isGridOptionLocked = (gridSize) => {
  const maxPoints = getLimit('keywordGridSettings', 'maxGridPoints')
  if (maxPoints === null || maxPoints >= 999) return false
  
  const points = gridSize * gridSize
  return points > maxPoints
}

// Get required plan name for locked options
const getRequiredPlanName = (gridSize) => {
  const points = gridSize * gridSize
  const feature = useFeatures().features.keywordGridSettings
  
  if (!feature || !feature.limits || !feature.limits.maxGridPoints) return null
  
  const limits = feature.limits.maxGridPoints
  
  // Find the minimum plan that supports this grid size
  if (points <= limits.basic) return PLAN_NAMES.basic
  if (points <= limits.professional) return PLAN_NAMES.professional
  return PLAN_NAMES.enterprise
}

// Check if step option is locked
const isStepLocked = (stepKm) => {
  const stepMeters = stepKm * 1000
  const maxMeters = getLimit('keywordGridSettings', 'maxStepMeters')
  // Locked if step is GREATER than max allowed (reverse logic)
  return maxMeters !== null && stepMeters > maxMeters
}

// Get required plan for step option
const getRequiredPlanForStep = (stepKm) => {
  const stepMeters = stepKm * 1000
  const feature = useFeatures().features.keywordGridSettings
  
  if (!feature || !feature.limits || !feature.limits.maxStepMeters) return null
  
  const limits = feature.limits.maxStepMeters
  
  // Find the minimum plan that allows this step size (larger step needs better plan)
  if (stepMeters <= limits.basic) return PLAN_NAMES.basic
  if (stepMeters <= limits.professional) return PLAN_NAMES.professional
  if (stepMeters <= limits.enterprise) return PLAN_NAMES.enterprise
  return PLAN_NAMES.enterprise
}

// Get all unique step values from all plans
const getAllStepValues = () => {
  const feature = useFeatures().features.keywordGridSettings
  if (!feature || !feature.limits || !feature.limits.maxStepMeters) {
    return [1000, 1500, 2000] // defaults
  }
  
  const limits = feature.limits.maxStepMeters
  const values = new Set([limits.basic, limits.professional, limits.enterprise])
  return Array.from(values).sort((a, b) => a - b) // ascending order
}

// Available step options dynamically generated from config
const stepOptions = computed(() => {
  const stepValues = getAllStepValues()
  const descriptions = [
    'Podstawowy obszar',
    'Średni obszar',
    'Szeroki obszar',
    'Bardzo szeroki obszar',
    'Maksymalny obszar'
  ]
  
  return stepValues.map((meters, index) => ({
    km: meters / 1000,
    meters,
    description: descriptions[index] || 'Obszar skanowania',
    locked: isStepLocked(meters / 1000),
    requiredPlan: getRequiredPlanForStep(meters / 1000)
  }))
})

// Get max step in km from plan limits
const maxStepKm = computed(() => {
  const maxMeters = getLimit('keywordGridSettings', 'maxStepMeters')
  return maxMeters ? maxMeters / 1000 : 2.0 // Convert to km
})

const gridSizeOptions = computed(() => [
  { 
    value: 3, 
    title: '3×3 (Mała)', 
    description: '9 punktów – szybkie skanowanie',
    locked: isGridOptionLocked(3),
    requiredPlan: getRequiredPlanName(3)
  },
  { 
    value: 6, 
    title: '6×6 (Średnia)', 
    description: '36 punktów – zbalansowane',
    locked: isGridOptionLocked(6),
    requiredPlan: getRequiredPlanName(6)
  },
  { 
    value: 9, 
    title: '9×9 (Duża)', 
    description: '81 punktów – dokładne wyniki',
    locked: isGridOptionLocked(9),
    requiredPlan: getRequiredPlanName(9)
  }
])

// Auto-reset to valid values when plan changes
watch([currentPlanLevel, () => props.gridSize, () => props.stepKm], ([newPlanLevel, gridSize, stepKm]) => {
  // Check if current grid size is locked
  if (isGridOptionLocked(gridSize)) {
    // Find the largest unlocked option
    const validOptions = gridSizeOptions.value.filter(opt => !opt.locked)
    if (validOptions.length > 0) {
      const largestValid = validOptions[validOptions.length - 1]
      emit('update:gridSize', largestValid.value)
    }
  }
  
  // Check if current step is above maximum
  if (stepKm > minStepKm.value) {
    emit('update:stepKm', minStepKm.value)
  }
}, { immediate: true })
</script>
