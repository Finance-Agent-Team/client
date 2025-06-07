import { NextResponse } from "next/server"
import type { RelativeRotationData } from "@/lib/types"

// Mock data for demonstration
const mockResponses = [
  {
    response:
      "Based on your portfolio analysis, you achieved a 15.2% return in 2023, outperforming the S&P 500 by 2.7%. Your tech-heavy allocation contributed significantly to this outperformance.",
    charts: [
      {
        type: "line",
        title: "Portfolio vs S&P 500 - 2023",
        data: [
          { month: "Jan", portfolio: 100, sp500: 100 },
          { month: "Feb", portfolio: 105, sp500: 103 },
          { month: "Mar", portfolio: 112, sp500: 108 },
          { month: "Apr", portfolio: 118, sp500: 115 },
          { month: "May", portfolio: 125, sp500: 120 },
          { month: "Jun", portfolio: 120, sp500: 118 },
          { month: "Jul", portfolio: 128, sp500: 125 },
          { month: "Aug", portfolio: 122, sp500: 120 },
          { month: "Sep", portfolio: 115, sp500: 115 },
          { month: "Oct", portfolio: 110, sp500: 112 },
          { month: "Nov", portfolio: 118, sp500: 116 },
          { month: "Dec", portfolio: 115, sp500: 112 },
        ],
      },
    ],
  },
  {
    response:
      "Your portfolio shows strong diversification across sectors. However, I notice a 35% allocation to technology stocks, which while profitable in 2023, may expose you to sector-specific risks.",
    charts: [
      {
        type: "line",
        title: "Sector Performance Comparison",
        data: [
          { month: "Q1", tech: 115, healthcare: 108, finance: 105 },
          { month: "Q2", tech: 125, healthcare: 112, finance: 110 },
          { month: "Q3", tech: 118, healthcare: 115, finance: 108 },
          { month: "Q4", tech: 130, healthcare: 118, finance: 112 },
        ],
      },
    ],
  },
  {
    response:
      "Here's a relative rotation graph showing how different sectors are performing relative to the market. Technology and Communication Services are in the 'Leading' quadrant, showing strong relative strength and positive momentum.",
    charts: [
      {
        type: "relative-rotation" as const,
        title: "Sector Relative Rotation Analysis",
        xAxisLabel: "Relative Strength vs S&P 500",
        yAxisLabel: "Momentum (Rate of Change)",
        data: [
          { 
            name: "Technology", 
            relativeStrength: 108, 
            momentum: 105, 
            size: 120 
          },
          { 
            name: "Healthcare", 
            relativeStrength: 102, 
            momentum: 98, 
            size: 100 
          },
          { 
            name: "Financial Services", 
            relativeStrength: 95, 
            momentum: 92, 
            size: 110 
          },
          { 
            name: "Energy", 
            relativeStrength: 112, 
            momentum: 89, 
            size: 90 
          },
          { 
            name: "Consumer Discretionary", 
            relativeStrength: 88, 
            momentum: 103, 
            size: 105 
          },
          { 
            name: "Real Estate", 
            relativeStrength: 85, 
            momentum: 87, 
            size: 80 
          },
          { 
            name: "Communication Services", 
            relativeStrength: 106, 
            momentum: 107, 
            size: 115 
          },
          { 
            name: "Utilities", 
            relativeStrength: 92, 
            momentum: 95, 
            size: 85 
          }
        ] as RelativeRotationData[],
      },
    ],
  },
]

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user is asking for relative rotation or sector analysis
    if (message.toLowerCase().includes("relative") || 
        message.toLowerCase().includes("rotation") ||
        message.toLowerCase().includes("sector") ||
        message.toLowerCase().includes("quadrant")) {
      // Return the relative rotation graph response
      return NextResponse.json(mockResponses[2])
    }

    // Return a random mock response for other queries
    const randomResponse = mockResponses[Math.floor(Math.random() * 2)]

    return NextResponse.json(randomResponse)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
