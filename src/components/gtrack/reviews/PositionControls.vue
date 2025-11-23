<template>
  <div class="flex flex-col gap-4">
    <SelectButton 
        v-model="activeMode" 
        :options="options" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full" 
        :pt="{ button: { class: 'flex-1 text-[0.8rem] py-1' } }" 
    />
    
    <div class="flex items-center gap-4">
       <Slider 
            v-model="settings[currentKey]" 
            :min="currentConfig.min" 
            :max="currentConfig.max" 
            :step="currentConfig.step || 1" 
            class="flex-1" 
       />
       <InputNumber 
            v-model="settings[currentKey]" 
            :min="currentConfig.min" 
            :max="currentConfig.max" 
            :step="currentConfig.step || 1" 
            :suffix="currentConfig.suffix || ''"
            inputClass="w-20 text-center text-sm p-1"
            class="w-20"
            :minFractionDigits="currentConfig.step < 1 ? 1 : 0"
            :maxFractionDigits="currentConfig.step < 1 ? 1 : 0"
       />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SelectButton from 'primevue/selectbutton';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';

const props = defineProps({
    settings: {
        type: Object,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    config: {
        type: Object,
        default: () => ({
            top: { min: 0, max: 100, suffix: '%' },
            left: { min: 0, max: 100, suffix: '%' },
            size: { min: 0.5, max: 3, step: 0.1, suffix: 'x' }
        })
    }
});

const activeMode = ref('top');

const options = computed(() => {
    const opts = [
        { label: 'Pionowo', value: 'top' },
        { label: 'Poziomo', value: 'left' },
        { label: 'Rozmiar', value: 'size' }
    ];
    if (props.config.border) {
        opts.push({ label: 'Ramka', value: 'border' });
    }
    return opts;
});

const currentKey = computed(() => {
    if (activeMode.value === 'border') {
        // Special case: if prefix is 'qr', border maps to 'qr_border_width'
        // We assume the pattern is {prefix}_border_width
        return `${props.prefix}_border_width`;
    }
    return `${props.prefix}_${activeMode.value}`;
});

const currentConfig = computed(() => {
    // Special handling for border which maps to a different key pattern usually
    if (activeMode.value === 'border') {
        return props.config.border;
    }
    return props.config[activeMode.value] || {};
});
</script>
