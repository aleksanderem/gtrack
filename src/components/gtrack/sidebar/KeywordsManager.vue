<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">Słowa kluczowe</h3>

    <!-- Add Keyword Input -->
    <div class="mb-3">
      <InputText
        v-model="newKeyword"
        @keyup.enter="addKeyword"
        type="text"
        placeholder="Dodaj słowo kluczowe..."
        class="w-full"
      />
      <small class="text-gray-500">Naciśnij Enter aby dodać</small>
    </div>

    <!-- Keywords List -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(keyword, index) in keywords"
        :key="index"
        class="keyword-tag"
      >
        {{ keyword }}
        <i @click="removeKeyword(index)" class="pi pi-times remove"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps({
  keywords: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:keywords'])

const newKeyword = ref('')

const addKeyword = () => {
  if (newKeyword.value.trim()) {
    const updatedKeywords = [...props.keywords, newKeyword.value.trim()]
    emit('update:keywords', updatedKeywords)
    newKeyword.value = ''
  }
}

const removeKeyword = (index) => {
  const updatedKeywords = props.keywords.filter((_, i) => i !== index)
  emit('update:keywords', updatedKeywords)
}
</script>

<style scoped>
.keyword-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #1e40af;
  gap: 0.5rem;
}

.keyword-tag .remove {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.keyword-tag .remove:hover {
  opacity: 1;
}
</style>
