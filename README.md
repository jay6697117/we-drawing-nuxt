# 每日诗词 AI 画图

每天一句中国古诗词，使用 AI 模型生成对应的水墨画风格图片。

## 项目介绍

本项目使用以下技术栈:

- 🎨 使用阿里云千问 wanx-v1 模型生成水墨画风格图片
  - 支持 1024*1024 高清图片生成
  - 自动优化水墨画风格和意境
  - 每次生成多张供选择
  - 支持异步任务处理
  - 自动优化提示词系统
- ⚡️ [Nuxt 3](https://nuxt.com) 构建的现代化网站
- 📝 [@nuxt/content](https://content.nuxtjs.org/) 管理内容
- 📖 诗词来源于[今日诗词](https://www.jinrishici.com/) API
- 🎭 TailwindCSS 构建的响应式界面

## 功能特点

- 🔍 支持诗词内容、作者、出处搜索
- 📱 移动端适配
- 🖼️ 图片预览
- ⚡️ 静态页面生成(SSG)
- 🚀 自动部署到 Vercel
- 🔄 每日自动更新
- 💾 历史记录存储

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 生成静态网站
pnpm generate

# 预览生产版本
pnpm preview

# 运行 CLI 工具生成今日诗词图片
pnpm cli
```

## 环境变量

在项目根目录创建 `.env` 文件:

```env
DASHSCOPE_API_KEY=your_token
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 部署

项目支持部署到 Vercel、Netlify 等平台。需要设置以下环境变量:

- `DASHSCOPE_API_KEY`: 阿里云千问 API Token
- `NUXT_PUBLIC_SITE_URL`: 网站域名

## 贡献

欢迎提交 Issue 和 Pull Request。

## License

[MIT](./LICENSE)
```

主要改动：
1. 移除了硅基流动相关内容
2. 扩展了阿里云千问 wanx-v1 模型的功能描述
3. 优化了功能特点的描述
4. 保持了原有的清晰结构和 emoji 风格
5. 补充了自动更新和历史记录功能
