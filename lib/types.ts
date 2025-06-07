export interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  charts?: ChartData[]
  timestamp: Date
}

// New types for chat history API
export interface ChatHistoryItem {
  id: string
  message: string
  response: string
  has_chart: boolean
  chart: ChartData | null
  created_at: string
}

export interface ChatHistoryResponse {
  status: string
  chat_history: ChatHistoryItem[]
}

export interface RelativeRotationData {
  name: string
  relativeStrength: number
  momentum: number
  size?: number
  color?: string
}

export interface ChartData {
  type: "line" | "relative-rotation"
  title: string
  data: Record<string, any>[] | RelativeRotationData[]
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}
