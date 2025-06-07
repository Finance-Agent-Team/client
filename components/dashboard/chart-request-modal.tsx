"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, TrendingUp, PieChart, BarChart3, Activity } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { ChartData } from "@/lib/types"

interface ChartRequestModalProps {
  isOpen: boolean
  onClose: () => void  
  onChartCreated: (chartData: ChartData) => void
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function ChartRequestModal({ isOpen, onClose, onChartCreated }: ChartRequestModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const suggestedQueries = [
    {
      icon: TrendingUp,
      title: "Compare with S&P 500",
      query: "Compare my portfolio performance with the S&P 500 index over the last year"
    },
    {
      icon: BarChart3,
      title: "Compare with NASDAQ",
      query: "Show my portfolio vs NASDAQ performance"
    },
    {
      icon: Activity,
      title: "Sector Rotation Analysis",
      query: "Show me a relative rotation graph of different sectors to analyze their momentum and strength"
    },
    {
      icon: PieChart,
      title: "Custom Benchmark",
      query: "Create a custom benchmark comparison with my portfolio allocation"
    }
  ]

  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage
    if (!messageToSend.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch("/api/chart-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      })

      if (!response.ok) {
        // Fallback: create a mock chart for demonstration
        const mockChartData: ChartData = {
          type: "line",
          title: `Chart: ${messageToSend.slice(0, 30)}...`,
          data: [
            { date: "Jan", portfolio: 100, benchmark: 100 },
            { date: "Feb", portfolio: 105, benchmark: 102 },
            { date: "Mar", portfolio: 110, benchmark: 108 },
            { date: "Apr", portfolio: 108, benchmark: 105 },
            { date: "May", portfolio: 115, benchmark: 110 },
            { date: "Jun", portfolio: 120, benchmark: 112 },
          ]
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "I've created a chart based on your request. You can see the comparison between your portfolio and the selected benchmark.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        
        // Create the chart after a short delay
        setTimeout(() => {
          onChartCreated(mockChartData)
          toast({
            title: "Chart Created",
            description: "Your chart has been added to the dashboard.",
          })
        }, 1000)
        
        return
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai", 
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      if (data.chartData) {
        onChartCreated(data.chartData)
        toast({
          title: "Chart Created",
          description: "Your chart has been added to the dashboard.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleClose = () => {
    setMessages([])
    setInputMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chart Request Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me to create charts comparing your portfolio with market indexes, sectors, or custom benchmarks.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {messages.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQueries.map((suggestion, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => sendMessage(suggestion.query)}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <suggestion.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {suggestion.query}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-primary" : "bg-secondary"
                  }`}>
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to create a chart comparing your data..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={() => sendMessage()} disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 