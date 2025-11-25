<template>
  <section class="bg-white rounded-2xl shadow-sm p-6 space-y-8">
    <header class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold text-gray-900">Zarządzanie słowami kluczowymi</h3>
      <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
        Dodaj frazy, na które chcesz pozycjonować swoją wizytówkę. System będzie monitorował pozycje dla każdego z tych słów.
      </p>
    </header>

    <!-- Limit Warning Banner -->
    <LimitWarningBanner 
      v-if="keywordLimitStatus.hasLimit && (keywordLimitStatus.isExceeded || keywordLimitStatus.percentage >= 75)"
      :status="keywordLimitStatus"
      @upgrade="handleUpgrade"
    />

    <div class="space-y-4">
      <div class="flex gap-3">
        <InputGroup class="flex-1">
          <InputGroupAddon>
            <i class="pi pi-tag text-gray-400"></i>
          </InputGroupAddon>
          <InputText 
            v-model="newKeyword" 
            placeholder="Wpisz słowo kluczowe (np. 'mechanik warszawa')..." 
            @keydown.enter="addKeyword"
            class="w-full"
          />
        </InputGroup>
        <Button 
          label="Dodaj" 
          icon="pi pi-plus" 
          @click="addKeyword" 
          :disabled="!newKeyword.trim()"
          class="flex-shrink-0"
        />
      </div>

      <div v-if="keywords.length === 0" class="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-tags text-2xl text-gray-400"></i>
        </div>
        <h4 class="text-gray-900 font-medium mb-1">Brak zdefiniowanych słów kluczowych</h4>
        <p class="text-sm text-gray-500">Dodaj pierwszą frazę powyżej, aby rozpocząć monitorowanie</p>
      </div>

      <div v-else class="border border-gray-200 rounded-2xl overflow-hidden bg-white">
        <DataTable 
          :value="keywords" 
          dataKey="self"
          class="w-full"
          :pt="{
            root: { class: 'border-none' },
            header: { class: 'hidden' },
            thead: { class: 'hidden' } 
          }"
        >
          <!-- Numeration Column -->
          <Column style="width: 60px" bodyClass="pl-4 py-3">
            <template #body="{ index }">
              <Badge 
                :value="index + 1" 
                :severity="isKeywordWithinLimit(index) ? 'secondary' : 'warning'"
                :class="isKeywordWithinLimit(index) 
                  ? '!bg-blue-50 !text-blue-600 !min-w-[2rem] !h-[2rem] flex items-center justify-center'
                  : '!bg-orange-50 !text-orange-600 !min-w-[2rem] !h-[2rem] flex items-center justify-center'"
              ></Badge>
            </template>
          </Column>

          <!-- Keyword / Inline Edit Column -->
          <Column field="self" style="width: auto" bodyClass="py-3">
            <template #body="{ data, index }">
              <Inplace 
                class="w-full" 
                :closable="true" 
                :disabled="!isKeywordWithinLimit(index)"
                @open="startEditing(index)" 
                @close="cancelEditing"
              >
                <template #display>
                  <div 
                    class="flex items-center gap-2 py-1"
                    :class="isKeywordWithinLimit(index) ? 'group cursor-pointer' : 'cursor-not-allowed'"
                  >
                    <span 
                      class="font-medium text-[15px]"
                      :class="isKeywordWithinLimit(index) ? 'text-gray-900' : 'text-gray-400'"
                    >{{ data }}</span>
                    <Tag 
                      v-if="!isKeywordWithinLimit(index)" 
                      value="Nieaktywne" 
                      severity="warning"
                      class="text-xs"
                    />
                    <i 
                      v-if="isKeywordWithinLimit(index)"
                      class="pi pi-pencil text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    ></i>
                  </div>
                </template>
                <template #content="{ closeCallback }">
                  <div class="flex items-center gap-2 w-full max-w-md">
                    <InputText 
                      v-model="editingValues[index]" 
                      autofocus 
                      class="flex-1 h-9 text-sm" 
                      @keydown.enter="saveEdit(index, closeCallback)" 
                    />
                    <div class="flex items-center gap-1 shrink-0">
                      <Button 
                        icon="pi pi-check" 
                        text 
                        rounded 
                        class="!w-8 !h-8 !p-0 !text-green-600 hover:!bg-green-50 !rounded-full" 
                        @click="saveEdit(index, closeCallback)" 
                      />
                      <Button 
                        icon="pi pi-times" 
                        text 
                        rounded 
                        class="!w-8 !h-8 !p-0 !text-gray-500 hover:!bg-gray-100 !rounded-full" 
                        @click="closeCallback" 
                      />
                    </div>
                  </div>
                </template>
              </Inplace>
            </template>
          </Column>

          <!-- Actions Column -->
          <Column style="width: 60px" bodyClass="pr-4 py-3 text-right">
            <template #body="{ index }">
              <Button 
                icon="pi pi-trash" 
                text 
                severity="secondary" 
                rounded 
                aria-label="Usuń"
                @click="confirmDelete(index)"
                :class="[
                  'w-8 h-8 !p-0 transition-colors',
                  isKeywordWithinLimit(index) 
                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                    : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                ]"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Liczba fraz: <strong class="text-gray-900">{{ keywords.length }}</strong>
        </span>
      </div>
    </div>

    <ConfirmDialog></ConfirmDialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import Inplace from 'primevue/inplace'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import LimitWarningBanner from '../common/LimitWarningBanner.vue'
import { useFeatures } from '../../../composables/useFeatures'

const props = defineProps({
  keywords: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:keywords'])
const confirm = useConfirm()
const router = useRouter()

const { getLimit, getLimitStatus } = useFeatures()

const newKeyword = ref('')
const editingValues = ref({})

// Get keyword limit status
const keywordLimitStatus = computed(() => {
  const status = getLimitStatus('keywords', 'maxKeywords', props.keywords.length)
  console.log('🔍 Keyword Limit Debug:', {
    currentCount: props.keywords.length,
    limit: getLimit('keywords', 'maxKeywords'),
    status: status
  })
  return status
})

// Check if keyword is within limit
const isKeywordWithinLimit = (index) => {
  const limit = getLimit('keywords', 'maxKeywords')
  return limit === null || limit >= 999 || index < limit
}

// Handle upgrade button click
const handleUpgrade = () => {
  router.push({ name: 'settings', query: { tab: 'subscription' } })
}

const addKeyword = () => {
  const trimmed = newKeyword.value.trim()
  if (trimmed) {
    if (!props.keywords.includes(trimmed)) {
      emit('update:keywords', [...props.keywords, trimmed])
      newKeyword.value = ''
    }
  }
}

const confirmDelete = (index) => {
  confirm.require({
    message: 'Czy na pewno chcesz usunąć to słowo kluczowe?',
    header: 'Potwierdzenie usunięcia',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
        label: 'Anuluj',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: 'Usuń',
        severity: 'danger'
    },
    accept: () => {
      const newKeywords = [...props.keywords]
      newKeywords.splice(index, 1)
      emit('update:keywords', newKeywords)
    }
  })
}

const startEditing = (index) => {
  editingValues.value[index] = props.keywords[index]
}

const cancelEditing = () => {
    // Optional cleanup
}

const saveEdit = (index, closeCallback) => {
  const trimmed = editingValues.value[index]?.trim()
  
  if (trimmed) {
    const isDuplicate = props.keywords.some((k, i) => i !== index && k === trimmed)
    
    if (!isDuplicate) {
      const newKeywords = [...props.keywords]
      newKeywords[index] = trimmed
      emit('update:keywords', newKeywords)
      if (closeCallback) closeCallback()
    }
  }
}
</script>
