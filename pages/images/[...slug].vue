<template>
  <div class="container mx-auto px-4 py-8">
    <ContentDoc v-slot="{ doc, refresh, isLoading }">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="doc" class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4">{{ doc.content }}</h1>
        <p class="text-xl mb-6">{{ doc.origin }} - {{ doc.author }}</p>
        <div class="grid gap-4">
          <div
            v-for="(imageUrl, index) in doc.images"
            :key="index"
            class="cursor-pointer"
            @click="openPreview(imageUrl)"
          >
            <img
              :src="imageUrl"
              :alt="doc.content"
              class="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
        <p class="text-gray-600 mt-4">生成时间：{{ formatDate(doc.date) }}</p>

        <div class="mt-8 flex gap-4">
          <button
            @click="copyText(doc.content)"
            class="btn btn-primary"
          >
            复制诗句
          </button>
          <button
            @click="refresh"
            class="btn btn-secondary"
          >
            刷新
          </button>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">内容不存在</p>
      </div>
    </ContentDoc>

    <ImagePreview
      v-if="previewImage"
      :src="previewImage"
      :alt="doc?.content || ''"
      :is-open="!!previewImage"
      @close="closePreview"
    />
  </div>
</template>

<script setup lang="ts">
const { formatDate, copyText } = usePoetry()
const route = useRoute()
const doc = ref<any>(null)

useHead({
  title: `${route.params.slug} - 每日诗词 AI 画图`
})

const previewImage = ref<string | null>(null)

const openPreview = (url: string) => {
  previewImage.value = url
}

const closePreview = () => {
  previewImage.value = null
}
</script>
