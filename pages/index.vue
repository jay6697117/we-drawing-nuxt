<template>
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold text-center my-8">每日诗词 AI 画图</h1>
    <div class="mb-8">
      <SearchBar
        ref="searchBarRef"
        v-model="searchQuery"
        @search="handleSearch"
        :disabled="isSearching"
      />
    </div>
    <div
      v-if="showError"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ errorMessage }}
      <button
        class="absolute top-0 right-0 px-4 py-3"
        @click="closeError"
      >
        ×
      </button>
    </div>
    <ContentList
      path="/images"
      :key="contentListKey"
      :query="{
        sort: [{ date: -1 }],
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        where: getSearchFilter()
      }"
    >
      <template #default="{ list }">
        <div v-if="isSearching" class="text-center py-12">
          <div class="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500">正在搜索...</p>
        </div>

        <template v-else>
          <div v-if="list.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PoetryCard
              v-for="poetry in list"
              :key="poetry._path"
              :poetry="poetry"
            />
          </div>

          <div v-else-if="searchQuery" class="text-center py-12">
            <p class="text-gray-500">
              未找到与"{{ searchQuery }}"相关的诗词
              <button
                class="text-blue-500 hover:text-blue-600 ml-2"
                @click="handleClearSearch"
              >
                清除搜索
              </button>
            </p>
          </div>
        </template>

        <div v-if="list.length && totalPages > 1" class="mt-8 flex justify-center gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="btn"
            :class="[
              page === currentPage ? 'btn-primary' : 'btn-secondary'
            ]"
            @click="changePage(page)"
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
const isSearching = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const contentListKey = ref(0) // 添加一个key来控制列表的重新渲染

// 定义SearchBar组件的接口
interface SearchBarInstance {
  focus: () => void;
}

const searchBarRef = ref<SearchBarInstance | null>(null) // 添加正确的类型定义

// 关闭错误提示
const closeError = () => {
  showError.value = false
}

// 根据搜索查询生成过滤条件
const getSearchFilter = () => {
  if (!searchQuery.value) return undefined

  // 修复查询结构，符合ContentQuery的where类型
  return {
    $or: [
      { content: { $regex: searchQuery.value } },
      { origin: { $regex: searchQuery.value } },
      { author: { $regex: searchQuery.value } }
    ]
  }
}

// 获取总数的函数
const getTotalCount = async (query?: string) => {
  const queryBuilder = queryContent('images')

  if (query) {
    queryBuilder.where({
      $or: [
        { content: { $regex: query } },
        { origin: { $regex: query } },
        { author: { $regex: query } }
      ]
    })
  }

  // 使用正确的方法获取总数
  const result = await queryBuilder.find()
  const count = result.length
  console.log('Search query:', query, 'Count:', count)
  return count
}

// 初始化总数
const { data: totalItems } = await useAsyncData('total-items', () => getTotalCount())

// 监听总数变化更新总页数
watchEffect(() => {
  if (totalItems.value) {
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  }
})

// 恢复搜索框焦点的函数
const restoreSearchFocus = () => {
  // 使用nextTick确保DOM更新后再设置焦点
  nextTick(() => {
    if (searchBarRef.value) {
      searchBarRef.value.focus()
    }
  })
}

// 处理搜索
const handleSearch = async (query: string) => {
  try {
    if (query === searchQuery.value && isSearching.value === false) {
      // 如果搜索词没变且不在搜索中，只需恢复焦点即可
      restoreSearchFocus()
      return
    }

    isSearching.value = true
    searchQuery.value = query
    currentPage.value = 1
    showError.value = false

    // 更新ContentList的key以触发重新渲染
    contentListKey.value++

    // 更新总数
    const count = await getTotalCount(query)
    totalItems.value = count

    // 如果搜索结果为空，但不显示错误
    if (count === 0) {
      restoreSearchFocus()
      return
    }
  } catch (error) {
    console.error('搜索出错:', error)
    errorMessage.value = '搜索遇到问题，请稍后重试'
    showError.value = true
  } finally {
    isSearching.value = false
    // 搜索完成后恢复焦点
    restoreSearchFocus()
  }
}

// 清除搜索的处理函数
const handleClearSearch = () => {
  searchQuery.value = ''
  contentListKey.value++
  handleSearch('')
}

// 翻页处理函数
const changePage = (page: number) => {
  if (currentPage.value !== page) {
    currentPage.value = page
    contentListKey.value++
    // 切换页面后恢复焦点
    restoreSearchFocus()
  }
}

// 在组件挂载后自动设置焦点
onMounted(() => {
  nextTick(() => {
    if (searchBarRef.value) {
      searchBarRef.value.focus()
    }
  })
})
</script>
