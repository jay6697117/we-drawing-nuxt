import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { get } from 'https'

export async function downloadImage(url: string, outputPath: string): Promise<string> {
    // 确保目录存在
    await mkdir(join(process.cwd(), 'public/images'), { recursive: true })

    return new Promise((resolve, reject) => {
        get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`))
                return
            }

            const filePath = join(process.cwd(), 'public', outputPath)
            const fileStream = createWriteStream(filePath)

            response.pipe(fileStream)

            fileStream.on('finish', () => {
                fileStream.close()
                resolve(outputPath)
            })

            fileStream.on('error', reject)
        }).on('error', reject)
    })
}
