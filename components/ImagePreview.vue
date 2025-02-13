<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-90" @click="close">
    <div class="absolute top-4 right-4">
      <button class="text-white text-2xl" @click="close">&times;</button>
    </div>
    <div class="h-full flex items-center justify-center p-4">
      <img
        :src="src"
        :alt="alt"
        class="max-h-full max-w-full object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  alt: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>
