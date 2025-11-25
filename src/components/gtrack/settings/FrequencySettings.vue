<template>
  <section class="bg-white rounded-2xl shadow-sm p-6 space-y-8">
    <header class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold text-gray-900">Harmonogram skanowania</h3>
      <p class="text-sm text-gray-500 max-w-2xl">
        Ustal jak często i kiedy GTRACK powinien automatycznie sprawdzać pozycje w wynikach wyszukiwania.
        Regularne skany pozwalają budować historię widoczności.
      </p>
    </header>

    <div class="space-y-4">
      <header>
        <h4 class="text-sm font-semibold text-gray-900">
          Częstotliwość
        </h4>
      </header>
      <div class="flex flex-col border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
        <label
          v-for="option in frequencyOptions"
          :key="option.value"
          class="flex items-center gap-4 px-5 py-4 transition-colors"
          :class="[
            option.locked 
              ? 'bg-gray-50 opacity-60 cursor-not-allowed' 
              : 'cursor-pointer hover:bg-gray-50',
            selectedFrequency === option.value && !option.locked ? 'bg-blue-50/50' : ''
          ]"
        >
          <RadioButton 
            v-model="selectedFrequency" 
            :value="option.value" 
            :disabled="option.locked"
            name="frequency" 
          />
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 gap-1">
            <div class="flex items-center gap-2">
              <span class="font-medium" :class="option.locked ? 'text-gray-400' : 'text-gray-900'">
                {{ option.label }}
              </span>
              <Tag 
                v-if="option.locked" 
                :value="option.requiredPlanName"
                severity="warning"
                icon="pi pi-lock"
                class="text-[10px]"
              />
            </div>
            <span class="text-sm text-gray-500">
              {{ option.description }}
            </span>
          </div>
        </label>
      </div>
    </div>

    <div v-if="selectedFrequency !== 'manual'" class="space-y-4">
      <header>
        <h4 class="text-sm font-semibold text-gray-900">
          Szczegóły harmonogramu
        </h4>
      </header>
      
      <div class="grid gap-6 md:grid-cols-2 bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <!-- Dzień tygodnia (dla Weekly/Biweekly) -->
        <div v-if="['weekly', 'biweekly'].includes(selectedFrequency)" class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Dzień tygodnia</label>
          <Select
            v-model="selectedWeekDay"
            :options="weekDays"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- Dzień miesiąca (dla Monthly) -->
        <div v-if="selectedFrequency === 'monthly'" class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Dzień miesiąca</label>
          <Select
            v-model="selectedMonthDay"
            :options="monthDays"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            scrollHeight="300px"
          />
        </div>

        <!-- Godzina (dla wszystkich auto) -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Godzina rozpoczęcia</label>
          <InputText v-model="selectedTime" type="time" class="w-full" />
        </div>
      </div>

      <Message severity="secondary" :closable="false" icon="pi pi-info-circle">
        <span v-if="selectedFrequency === 'daily'">
          Skanowanie będzie uruchamiane codziennie o godzinie <strong>{{ selectedTime }}</strong>.
        </span>
        <span v-else-if="selectedFrequency === 'weekly'">
          Skanowanie w każdy <strong>{{ getWeekDayLabel(selectedWeekDay) }}</strong> o godzinie <strong>{{ selectedTime }}</strong>.
        </span>
        <span v-else-if="selectedFrequency === 'biweekly'">
          Skanowanie co drugi tydzień w <strong>{{ getWeekDayLabel(selectedWeekDay) }}</strong> o godzinie <strong>{{ selectedTime }}</strong>.
        </span>
        <span v-else-if="selectedFrequency === 'monthly'">
          Skanowanie <strong>{{ selectedMonthDay }}. dnia</strong> każdego miesiąca o godzinie <strong>{{ selectedTime }}</strong>.
        </span>
      </Message>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
      <i class="pi pi-shield text-blue-600 mt-0.5"></i>
      <div class="text-sm text-blue-900">
        <p class="font-medium mb-1">Automatyzacja w tle</p>
        <p class="opacity-80">
          Wszystkie zaplanowane skany są wykonywane po stronie serwera. Nie musisz mieć otwartej przeglądarki ani być zalogowanym, aby pomiary zostały wykonane.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { useFeatures } from '../../../composables/useFeatures'
import { PLAN_NAMES, PLANS } from '../../../config/features'

const { currentPlan } = useFeatures()

// Get available frequencies from localStorage (Debug Bar overrides) or config
const getAvailableFrequencies = () => {
  const localOverrides = JSON.parse(localStorage.getItem('featureFrequencies') || '{}')
  const scheduleOverrides = localOverrides['keywordScanningSchedule']
  
  if (scheduleOverrides && scheduleOverrides[currentPlan.value]) {
    return scheduleOverrides[currentPlan.value]
  }
  
  // Fallback to config defaults
  const configDefaults = {
    [PLANS.BASIC]: ['monthly', 'biweekly', 'weekly', 'manual'],
    [PLANS.PROFESSIONAL]: ['monthly', 'biweekly', 'weekly', 'daily', 'manual'],
    [PLANS.ENTERPRISE]: ['monthly', 'biweekly', 'weekly', 'daily', 'hourly', 'manual']
  }
  
  return configDefaults[currentPlan.value] || configDefaults[PLANS.BASIC]
}

// All possible frequency options with metadata
const allFrequencyOptions = [
  { value: 'hourly', label: 'Co godzinę', description: 'Maksymalne monitorowanie', requiredPlan: PLANS.ENTERPRISE },
  { value: 'daily', label: 'Codziennie', description: 'Intensywne monitorowanie zmian', requiredPlan: PLANS.PROFESSIONAL },
  { value: 'weekly', label: 'Raz w tygodniu', description: 'Standardowy cykl raportowania', requiredPlan: PLANS.BASIC },
  { value: 'biweekly', label: 'Co 2 tygodnie', description: 'Zbalansowane użycie zasobów', requiredPlan: PLANS.BASIC },
  { value: 'monthly', label: 'Raz w miesiącu', description: 'Podsumowania długoterminowe', requiredPlan: PLANS.BASIC },
  { value: 'manual', label: 'Ręcznie', description: 'Tylko na żądanie użytkownika', requiredPlan: PLANS.BASIC }
]

// Dynamically filtered options based on plan
const frequencyOptions = computed(() => {
  const availableFreqs = getAvailableFrequencies()
  
  return allFrequencyOptions.map(option => ({
    ...option,
    locked: !availableFreqs.includes(option.value),
    requiredPlanName: PLAN_NAMES[option.requiredPlan]
  }))
})

const weekDays = [
  { label: 'Poniedziałek', value: 1 },
  { label: 'Wtorek', value: 2 },
  { label: 'Środa', value: 3 },
  { label: 'Czwartek', value: 4 },
  { label: 'Piątek', value: 5 },
  { label: 'Sobota', value: 6 },
  { label: 'Niedziela', value: 7 }
]

const monthDays = Array.from({ length: 31 }, (_, index) => ({
  label: `${index + 1}. dzień miesiąca`,
  value: index + 1
}))

const selectedFrequency = ref('weekly')
const selectedWeekDay = ref(1)
const selectedMonthDay = ref(1)
const selectedTime = ref('09:00')

const getWeekDayLabel = (value) => {
  const day = weekDays.find(d => d.value === value)
  return day ? day.label.toLowerCase() : ''
}
</script>
