export interface Poetry {
    content: string
    origin: string
    author: string
    category: string
    date: string
    images: string[]
    _path?: string
}

export interface PoetryResponse {
    content: string
    origin: string
    author: string
    category: string
}
