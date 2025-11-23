<template>
  <div class="flex flex-col gap-10">
    <header v-if="title || subtitle" class="flex flex-col items-start gap-2">
      <h2 v-if="title" class="text-gray-900 text-2xl font-semibold leading-tight">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-gray-500 text-base leading-tight max-w-2xl">
        {{ subtitle }}
      </p>
    </header>
    <div class="grid grid-cols-12 gap-3 lg:gap-3">
      <aside class="col-span-12 lg:col-span-3 xl:col-span-3 lg:sticky lg:top-24 space-y-3">
        <SettingsNavigation v-model="model" :items="items" :title="navTitle" />
      </aside>
      <section class="col-span-12 lg:col-span-9 xl:col-span-9 space-y-4 lg:pl-4 xl:pl-4">
        <slot />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SettingsNavigation from './SettingsNavigation.vue'

const props = defineProps({
  title: { type: String, default: 'Settings' },
  subtitle: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  navTitle: { type: String, default: 'Navigation' },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
