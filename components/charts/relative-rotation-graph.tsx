"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RelativeRotationData {
  name: string
  relativeStrength: number
  momentum: number
  size?: number
  color?: string
}

interface RelativeRotationGraphProps {
  title: string
  data: RelativeRotationData[]
  xAxisLabel?: string
  yAxisLabel?: string
}

const quadrantColors = {
  leading: "#22c55e", // green - high RS, high momentum
  weakening: "#eab308", // yellow - high RS, low momentum  
  lagging: "#ef4444", // red - low RS, low momentum
  improving: "#3b82f6", // blue - low RS, high momentum
}

const getQuadrantInfo = (rs: number, momentum: number) => {
  if (rs >= 100 && momentum >= 100) {
    return { label: "Leading", color: quadrantColors.leading, description: "Strong & Accelerating" }
  } else if (rs >= 100 && momentum < 100) {
    return { label: "Weakening", color: quadrantColors.weakening, description: "Strong but Decelerating" }
  } else if (rs < 100 && momentum < 100) {
    return { label: "Lagging", color: quadrantColors.lagging, description: "Weak & Decelerating" }
  } else {
    return { label: "Improving", color: quadrantColors.improving, description: "Weak but Accelerating" }
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const quadrant = getQuadrantInfo(data.relativeStrength, data.momentum)
    
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: quadrant.color }}
          />
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="space-y-1 text-sm">
          <div>Relative Strength: {data.relativeStrength.toFixed(1)}</div>
          <div>Momentum: {data.momentum.toFixed(1)}</div>
          <Badge variant="secondary" className="text-xs">
            {quadrant.label} - {quadrant.description}
          </Badge>
        </div>
      </div>
    )
  }
  return null
}

export function RelativeRotationGraph({ 
  title, 
  data, 
  xAxisLabel = "Relative Strength", 
  yAxisLabel = "Momentum" 
}: RelativeRotationGraphProps) {
  // Add colors to data points based on quadrant
  const enhancedData = data.map((item) => {
    const quadrant = getQuadrantInfo(item.relativeStrength, item.momentum)
    return {
      ...item,
      color: item.color || quadrant.color,
      size: item.size || 100,
      quadrant: quadrant.label
    }
  })

  // Calculate chart bounds with some padding
  const allRS = data.map(d => d.relativeStrength)
  const allMomentum = data.map(d => d.momentum)
  const minRS = Math.min(...allRS, 90)
  const maxRS = Math.max(...allRS, 110)
  const minMomentum = Math.min(...allMomentum, 90)
  const maxMomentum = Math.max(...allMomentum, 110)

  const legendData = [
    { label: "Leading", color: quadrantColors.leading, description: "Strong & Accelerating" },
    { label: "Weakening", color: quadrantColors.weakening, description: "Strong but Decelerating" },
    { label: "Lagging", color: quadrantColors.lagging, description: "Weak & Decelerating" },
    { label: "Improving", color: quadrantColors.improving, description: "Weak but Accelerating" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">({item.description})</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            data={enhancedData}
            margin={{
              top: 20,
              right: 20,
              bottom: 60,
              left: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            
            {/* Reference lines for quadrants */}
            <ReferenceLine 
              x={100} 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <ReferenceLine 
              y={100} 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            
            <XAxis 
              type="number" 
              dataKey="relativeStrength"
              domain={[minRS - 5, maxRS + 5]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: xAxisLabel, 
                position: 'insideBottom', 
                offset: -10,
                style: { textAnchor: 'middle' }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="momentum"
              domain={[minMomentum - 5, maxMomentum + 5]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Scatter dataKey="size" fill="#8884d8">
              {enhancedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Quadrant labels */}
        <div className="relative -mt-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="flex justify-between w-full max-w-lg">
              <div className="text-xs text-muted-foreground font-medium">
                Improving
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Leading
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div className="flex justify-between w-full max-w-lg">
              <div className="text-xs text-muted-foreground font-medium">
                Lagging
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Weakening
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 