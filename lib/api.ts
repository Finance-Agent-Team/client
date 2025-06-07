import { ChatHistoryResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`)
  }

  return response.json()
}

export const chatApi = {
  getChatHistory: async (userId: string, limit: number = 100): Promise<ChatHistoryResponse> => {
    const endpoint = `/chat/history?user_id=${userId}&limit=${limit}`
    return apiRequest<ChatHistoryResponse>(endpoint)
  },

  sendMessage: async (message: string, userId: string): Promise<any> => {
    const endpoint = '/chat'
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        user_id: userId 
      }),
    })
  },

  getChart: async (chartId: string): Promise<any> => {
    const endpoint = `/chart/${chartId}`
    return apiRequest(endpoint)
  },
} 