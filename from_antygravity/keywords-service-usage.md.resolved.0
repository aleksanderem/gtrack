# Używanie Keywords Service

## Import
```javascript
import { getKeywords, addKeyword, updateKeywords, deleteKeyword } from '@/services/KeywordsService'
```

## Przykład użycia w komponencie

```vue
<script setup>
import { ref, onMounted, computed } from 'vue'
import { getKeywords, updateKeywords } from '../../../services/KeywordsService'
import { useFeatures } from '../../../composables/useFeatures'

const keywords = ref([])
const { getLimit, getLimitStatus } = useFeatures()

// Load keywords on mount
onMounted(async () => {
  keywords.value = await getKeywords('demo-location')
})

// Limit status
const keywordLimitStatus = computed(() => {
  return getLimitStatus('keywords', 'maxKeywords', keywords.value.length)
})

// Check if within limit
const isKeywordWithinLimit = (index) => {
  const limit = getLimit('keywords', 'maxKeywords')
  return limit === null || limit >= 999 || index < limit
}

// Add keyword
const addNewKeyword = async (keyword) => {
  const updated = await addKeyword('demo-location', keyword)
  keywords.value = updated
}

// Update all keywords
const saveKeywords = async (newKeywords) => {
  await updateKeywords('demo-location', newKeywords)
  keywords.value = newKeywords
}
</script>
```

## Mock Data

**demo-location**: 5 słów (przekracza limit Basic = 2)
- restaurant dublin
- best food dublin  
- italian restaurant ← NIEAKTYWNE (Basic)
- pizza delivery ← NIEAKTYWNE (Basic)
- fine dining dublin ← NIEAKTYWNE (Basic)

**location-2**: 2 słowa (w limicie)
- coffee shop
- cafe near me

**location-3**: 8 słów (dla testów wyższych limitów)
