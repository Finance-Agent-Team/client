export interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  charts?: ChartData[]
  timestamp: Date
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
