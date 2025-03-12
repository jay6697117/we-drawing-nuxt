import { getImageBySentence } from '../utils/image-creator'
import { getSentence } from '../utils/poetry'
import { formatDate } from '../utils/date'
import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { join } from 'path'
import minimist from 'minimist'
import dotenv from 'dotenv'
import axios from 'axios'
import { promisify } from 'util'
import { pipeline } from 'stream'

// 加载 .env 文件
dotenv.config()

// 下载图片函数
async function downloadImage(url: string, imagePath: string): Promise<boolean> {
    try {
        const pipelineAsync = promisify(pipeline);
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        await pipelineAsync(response.data, createWriteStream(imagePath));
        console.log(`图片下载成功: ${imagePath}`);
        return true;
    } catch (error) {
        console.error(`下载图片失败: ${url}`, error);
        return false;
    }
}

async function init() {
    const argv = minimist(process.argv.slice(2))
    // 优先使用命令行参数，其次使用环境变量
    const token = argv.token || process.env.DASHSCOPE_API_KEY

    if (!token) {
        throw new Error("Please provide a token using the --token argument or DASHSCOPE_API_KEY environment variable")
    }

    try {
        // 获取诗句
        const poetry = await getSentence()
        console.log('Poetry:', poetry)

        // 生成图片
        console.log('Generating image for:', poetry.content)
        const res = await getImageBySentence(token, poetry.content)
        console.log('Generated images:', res.images)

        // 生成文件名（使用时间戳确保唯一性）
        const date = new Date()
        const timestamp = date.getTime()
        const baseFileName = formatDate(date, 'YYYY-MM-DD')
        const fileName = `${baseFileName}-${timestamp}`

        // 创建本地图片存储目录
        const publicImageDir = join(process.cwd(), 'public/images', fileName)
        if (!existsSync(publicImageDir)) {
            mkdirSync(publicImageDir, { recursive: true })
            console.log(`创建图片目录: ${publicImageDir}`)
        }

        // 下载图片并更新URL
        const localImages = []
        for (let i = 0; i < res.images.length; i++) {
            const imageUrl = res.images[i]
            // 提取文件扩展名，或默认为.png
            const urlObj = new URL(imageUrl)
            const pathname = urlObj.pathname
            let extension = pathname.split('.').pop() || 'png'
            if (extension.includes('?')) {
                extension = extension.split('?')[0]
            }
            if (!extension.startsWith('.')) {
                extension = '.' + extension
            }
            
            const localFileName = `image-${i + 1}${extension}`
            const localFilePath = join(publicImageDir, localFileName)
            
            // 下载图片
            const success = await downloadImage(imageUrl, localFilePath)
            
            // 更新图片路径为相对路径（从public目录开始）
            if (success) {
                const relativePathForJson = `/images/${fileName}/${localFileName}`
                localImages.push(relativePathForJson)
            } else {
                // 如果下载失败，保留原URL
                localImages.push(imageUrl)
            }
        }

        // 准备数据
        const outputData = {
            ...poetry,
            images: localImages,  // 使用更新后的本地图片路径
            date: date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
        }

        // 确保目录存在
        const contentPath = join(process.cwd(), 'content/images')
        if (!existsSync(contentPath)) {
            mkdirSync(contentPath, { recursive: true })
        }

        // 写入文件
        const contentFile = join(contentPath, `${fileName}.json`)
        writeFileSync(contentFile, JSON.stringify(outputData, null, 2))
        console.log('Content file written:', contentFile)
        console.log('Output data:', outputData)

        console.log('Successfully generated and downloaded images:', fileName)
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

init()
