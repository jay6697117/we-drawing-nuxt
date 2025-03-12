const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// 本地图片存储路径
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images');
// JSON文件路径
const JSON_DIR = path.join(process.cwd(), 'content', 'images');

// 创建目录(如果不存在)
async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch (err) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`创建目录: ${dir}`);
  }
}

// 下载图片
async function downloadImage(url, imagePath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    await pipeline(response.data, createWriteStream(imagePath));
    console.log(`图片下载成功: ${imagePath}`);
    return true;
  } catch (error) {
    console.error(`下载图片失败: ${url}`, error.message);
    return false;
  }
}

// 处理单个JSON文件
async function processJsonFile(jsonFile) {
  try {
    const jsonPath = path.join(JSON_DIR, jsonFile);
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);
    
    // 如果没有图片，跳过
    if (!data.images || data.images.length === 0) {
      console.log(`跳过无图片的文件: ${jsonFile}`);
      return;
    }
    
    // 为该JSON文件创建对应的图片目录
    const fileNameWithoutExt = path.basename(jsonFile, '.json');
    const imageSubDir = path.join(IMAGE_DIR, fileNameWithoutExt);
    await ensureDir(imageSubDir);
    
    // 下载图片并更新路径
    const updatedImages = [];
    
    for (let i = 0; i < data.images.length; i++) {
      const imageUrl = data.images[i];
      // 提取文件扩展名，或默认为.png
      const urlObj = new URL(imageUrl);
      const pathname = urlObj.pathname;
      let extension = path.extname(pathname) || '.png';
      if (extension.includes('?')) {
        extension = extension.split('?')[0];
      }
      
      const localFileName = `image-${i + 1}${extension}`;
      const localFilePath = path.join(imageSubDir, localFileName);
      
      // 下载图片
      const success = await downloadImage(imageUrl, localFilePath);
      
      // 更新图片路径为相对路径（从public目录开始）
      if (success) {
        const relativePathForJson = `/images/${fileNameWithoutExt}/${localFileName}`;
        updatedImages.push(relativePathForJson);
      } else {
        // 如果下载失败，保留原URL
        updatedImages.push(imageUrl);
      }
    }
    
    // 更新JSON
    data.images = updatedImages;
    
    // 写回JSON文件
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`更新JSON文件: ${jsonFile}`);
    
  } catch (error) {
    console.error(`处理JSON文件失败: ${jsonFile}`, error);
  }
}

// 主函数
async function main() {
  try {
    // 确保图片目录存在
    await ensureDir(IMAGE_DIR);
    
    // 获取所有JSON文件
    const files = await fs.readdir(JSON_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`找到 ${jsonFiles.length} 个JSON文件`);
    
    // 处理所有JSON文件
    for (const jsonFile of jsonFiles) {
      console.log(`处理文件: ${jsonFile}`);
      await processJsonFile(jsonFile);
    }
    
    console.log('所有图片下载和JSON更新完成!');
  } catch (error) {
    console.error('处理过程中发生错误:', error);
  }
}

// 运行脚本
main();
