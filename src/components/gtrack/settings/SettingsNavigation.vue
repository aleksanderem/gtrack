<template>
  <div class="w-full lg:w-64 xl:w-72 bg-white rounded-2xl shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <span class="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
        {{ title }}
      </span>
    </div>
    <div class="p-2 space-y-1">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="w-full flex items-start gap-3.5 px-4 py-3 text-left rounded-xl transition-all duration-200 group"
        :class="[
          item.id === modelValue 
            ? 'bg-blue-50 text-blue-700 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border border-blue-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
        ]"
        @click="select(item.id)"
      >
        <i 
          :class="[
            item.icon, 
            'text-lg mt-0.5 transition-colors',
            item.id === modelValue ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
          ]" 
        />
        <div class="flex-1 min-w-0">
          <span class="block text-[15px] font-medium leading-snug tracking-tight">
            {{ item.label }}
          </span>
          <span 
            v-if="item.description" 
            class="block text-[13px] leading-relaxed mt-0.5 transition-colors"
            :class="item.id === modelValue ? 'text-blue-600/80' : 'text-gray-500'"
          >
            {{ item.description }}
          </span>
        </div>
        <Badge
          v-if="item.badge"
          severity="info"
          :value="item.badge"
          class="self-center ml-2"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import Badge from 'primevue/badge'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Organization'
  }
})

const emit = defineEmits(['update:modelValue'])

const select = (id) => {
  emit('update:modelValue', id)
}
</script>
