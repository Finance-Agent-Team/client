import { useState, useEffect } from 'react'
import { chatApi, ApiError } from '@/lib/api'
import { ChatHistoryItem } from '@/lib/types'

interface UseChatHistoryProps {
  userId: string
  limit?: number
  autoFetch?: boolean
}

interface UseChatHistoryReturn {
  chatHistory: ChatHistoryItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useChatHistory({ 
  userId, 
  limit = 100, 
  autoFetch = true 
}: UseChatHistoryProps): UseChatHistoryReturn {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChatHistory = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await chatApi.getChatHistory(userId, limit)
      setChatHistory(response.chat_history)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to fetch chat history: ${err.message}`)
      } else {
        setError('An unexpected error occurred while fetching chat history')
      }
      console.error('Error fetching chat history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch && userId) {
      fetchChatHistory()
    }
  }, [userId, limit, autoFetch])

  return {
    chatHistory,
    loading,
    error,
    refetch: fetchChatHistory,
  }
} 