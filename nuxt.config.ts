// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],

  nitro: {
    preset: 'vercel'
  },

  // @ts-ignore
  content: {
    documentDrive: true,
    markdown: {
      tags: {
        h1: 'h1',
        h2: 'h2'
      }
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://we-drawing.com'
    }
  },

  app: {
    head: {
      title: '每日诗词 AI 画图',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: '每天一句中国古诗词，生成 AI 图片'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
