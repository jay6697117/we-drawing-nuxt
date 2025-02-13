/// <reference types="@nuxt/types" />
/// <reference types="@nuxt/content" />

declare module '#content/server' {
    const serverQueryContent: typeof import('@nuxt/content').serverQueryContent
}

interface Poetry {
    content: string
    origin: string
    author: string
    category: string
    date: string
    images: string[]
    _path?: string
}
