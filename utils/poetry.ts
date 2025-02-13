import type { Poetry } from '../types/poetry'

const SENTENCE_API = 'https://v1.jinrishici.com/all.json'

export async function getSentence(): Promise<Poetry> {
    try {
        const res = await fetch(SENTENCE_API)
        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(`Failed to fetch poetry: ${error}`)
    }
}
