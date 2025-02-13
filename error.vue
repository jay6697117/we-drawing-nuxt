<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">{{ error.statusCode }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ error.message }}</p>
      <button
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        @click="handleError"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const handleError = () => {
  clearError()
  navigateTo('/')
}
</script>
