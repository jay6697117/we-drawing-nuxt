<template>
  <div class="search-bar relative w-full">
    <div class="relative flex items-center">
      <!-- 搜索图标 -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- 搜索输入框 -->
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="emitSearch"
        placeholder="搜索诗词、作者或来源..."
        class="w-full pl-10 pr-16 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm"
        :class="{'opacity-70': disabled}"
        :disabled="disabled"
      />
      
      <!-- 搜索按钮 -->
      <button
        @click="emitSearch"
        class="absolute right-1 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-sm"
        :class="{'opacity-70 cursor-not-allowed': disabled}"
        :disabled="disabled"
      >
        搜索
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search'])
const inputRef = ref<HTMLInputElement | null>(null)

const emitSearch = () => {
  // 优先使用modelValue，如果没有则使用value作为后备
  const searchValue = props.modelValue || props.value || ''
  emit('search', searchValue)
}

// 暴露focus方法给父组件使用
defineExpose({
  focus: () => {
    inputRef.value?.focus()
  }
})
</script>
