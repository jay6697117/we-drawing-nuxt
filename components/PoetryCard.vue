<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <NuxtLink :to="poetry._path">
      <div class="relative aspect-w-16 aspect-h-9">
        <img
          :src="poetry.images[0]"
          :alt="poetry.content"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-2">{{ poetry.content }}</h2>
        <p class="text-gray-600">{{ poetry.origin }} - {{ poetry.author }}</p>
        <p class="text-gray-500 text-sm mt-2">{{ formatDate(poetry.date) }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Poetry } from '~/types/poetry'

const { formatDate } = usePoetry()

defineProps<{
  poetry: Poetry
}>()
</script>
