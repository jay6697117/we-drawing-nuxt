<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索诗词内容、作者、出处..."
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      :disabled="disabled"
      @input="handleInput"
    />
    <div
      v-if="disabled"
      class="absolute right-3 top-1/2 -translate-y-1/2"
    >
      <div class="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  disabled?: boolean
}>()

const searchQuery = ref('')

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

// 使用防抖处理搜索
const debouncedSearch = useDebounceFn((query: string) => {
  emit('search', query)
}, 500)

// 处理输入
const handleInput = () => {
  const trimmedQuery = searchQuery.value.trim()
  debouncedSearch(trimmedQuery)
}
</script>
