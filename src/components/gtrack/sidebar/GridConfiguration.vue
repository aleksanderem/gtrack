<template>
  <section class="bg-white rounded-2xl shadow-sm p-6 space-y-8">
    <header class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold text-gray-900">Domyślna konfiguracja siatki</h3>
      <p class="text-sm text-gray-500 max-w-2xl">
        Dostosuj ilość punktów oraz odstępy, aby dopasować pomiar do charakterystyki miasta. 
        Większa siatka daje precyzyjniejszy obraz, mniejsza – szybsze wyniki.
      </p>
    </header>

    <div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
      <label
        v-for="option in gridSizeOptions"
        :key="option.value"
        class="flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors flex-1"
        :class="modelGridSize === option.value
          ? 'bg-blue-50/70 border-l-4 border-blue-400'
          : 'hover:bg-gray-50'"
      >
        <RadioButton v-model="modelGridSize" :value="option.value" name="grid-size" />
        <div class="flex flex-col gap-1 flex-1">
          <span class="text-gray-900 font-semibold leading-tight">
            {{ option.title }}
          </span>
          <span class="text-sm text-gray-500 leading-tight">
            {{ option.description }}
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
        </p>
      </header>
      <Slider
        v-model="modelStepKm"
        :min="0.5"
        :max="2"
        :step="0.5"
        class="w-full"
        @update:modelValue="$emit('update:stepKm', $event)"
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>500m</span>
        <span>1000m</span>
        <span>1500m</span>
        <span>2000m</span>
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
import { computed } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Slider from 'primevue/slider'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'

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

const modelGridSize = computed({
  get: () => props.gridSize,
  set: (value) => emit('update:gridSize', value)
})

const modelStepKm = computed({
  get: () => props.stepKm,
  set: (value) => emit('update:stepKm', value)
})

const modelCenterName = computed({
  get: () => props.centerName,
  set: (value) => emit('update:centerName', value)
})

const handleSearch = () => {
  emit('search-location', modelCenterName.value)
}

const gridSizeOptions = [
  { value: 3, title: '3×3 (Mała)', description: '9 punktów – szybkie skanowanie' },
  { value: 6, title: '6×6 (Średnia)', description: '36 punktów – zbalansowane' },
  { value: 9, title: '9×9 (Duża)', description: '81 punktów – dokładne wyniki' }
]
</script>
