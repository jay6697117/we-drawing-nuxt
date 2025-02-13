<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索诗词..."
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="handleSearch"
    />
    <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
      <div class="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const handleSearch = useDebounceFn(() => {
  isLoading.value = true
  emit('search', searchQuery.value)
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}, 300)
</script>
