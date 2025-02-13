import { getImageBySentence } from '../utils/image-creator'
import { getSentence } from '../utils/poetry'
import { formatDate } from '../utils/date'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import minimist from 'minimist'
import dotenv from 'dotenv'

// 加载 .env 文件
dotenv.config()

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

        // 准备数据
        const outputData = {
            ...poetry,
            images: res.images,  // 直接保存 URL 数组
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

        console.log('Successfully generated:', fileName)
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

init()
