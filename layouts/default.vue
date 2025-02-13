<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">每日诗词 AI 画图</NuxtLink>
        <div class="flex gap-4">
          <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900">关于</NuxtLink>
          <NuxtLink to="https://github.com/jay6697117/we-drawing-nuxt" class="text-gray-600 hover:text-gray-900">GitHub</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="py-8">
      <slot />
    </main>

    <footer class="bg-white py-8 mt-auto">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p class="mb-2">© {{ new Date().getFullYear() }} 每日诗词 AI 画图</p>
        <p class="text-sm">
          <a href="https://github.com/liruifengv/we-drawing" target="_blank" class="hover:text-gray-900">
            感谢liruifengv&nbsp;-&nbsp;GitHub
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>
