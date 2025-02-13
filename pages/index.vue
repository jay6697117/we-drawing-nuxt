<template>
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold text-center my-8">每日诗词 AI 画图</h1>
    <div class="mb-8">
      <SearchBar @search="handleSearch" />
    </div>
    <ContentList
      path="/images"
      :query="{
        sort: [{ date: -1 }],
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        where: searchQuery ? {
          $or: [
            { content: { $regex: searchQuery, $options: 'i' } },
            { origin: { $regex: searchQuery, $options: 'i' } },
            { author: { $regex: searchQuery, $options: 'i' } }
          ]
        } : undefined
      }"
    >
      <template #default="{ list }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-if="list.length">
            <PoetryCard
              v-for="poetry in list"
              :key="poetry._path"
              :poetry="poetry"
            />
          </template>
        </div>

        <!-- 分页 -->
        <div v-if="list.length" class="mt-8 flex justify-center gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="btn"
            :class="[
              page === currentPage ? 'btn-primary' : 'btn-secondary'
            ]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
      </template>

      <template #not-found>
        <div class="text-center py-12">
          <p class="text-gray-500">暂无内容</p>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-12">
          <p class="text-gray-500">暂无内容</p>
        </div>
      </template>
    </ContentList>
  </div>
</template>

<script setup lang="ts">
// 页面标题
useHead({
  title: '每日诗词 AI 画图 - 首页'
})

const pageSize = 9
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')

// 获取总页数
const { data: totalItems } = await useAsyncData('total-items', () =>
  queryContent('images').count()
)

watchEffect(() => {
  if (totalItems.value) {
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  }
})

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}
</script>
