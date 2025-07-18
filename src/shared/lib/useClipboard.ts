import { useState } from 'react'

export const useClipboard = (text: string | undefined) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      if (!text) {
        console.warn('Нет текста для копирования')
        setCopied(false)
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Сброс через 2 секунды
    } catch (err) {
      console.error('Не удалось скопировать:', err)
      setCopied(false)
    }
  }

  return { copied, copy }
}
