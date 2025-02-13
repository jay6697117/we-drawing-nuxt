export const usePoetry = () => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('复制失败:', err)
      return false
    }
  }

  return {
    formatDate,
    copyText
  }
}
