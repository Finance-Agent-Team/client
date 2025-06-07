"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RelativeRotationGraph } from "./relative-rotation-graph"
import type { ChartData, RelativeRotationData } from "@/lib/types"

interface PortfolioChartProps {
  chart: ChartData
}

export function PortfolioChart({ chart }: PortfolioChartProps) {
  // Handle relative rotation graph
  if (chart.type === "relative-rotation") {
    return (
      <RelativeRotationGraph
        title={chart.title}
        data={chart.data as RelativeRotationData[]}
        xAxisLabel={chart.xAxisLabel}
        yAxisLabel={chart.yAxisLabel}
      />
    )
  }

  // Handle regular line chart
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]
  const lineChartData = chart.data as Record<string, any>[]

  // Calculate Y-axis domain to center 0% in the middle
  const allValues = lineChartData.flatMap(item => 
    Object.keys(item)
      .filter(key => key !== 'date') // Exclude date field
      .map(key => item[key])
      .filter(value => typeof value === 'number')
  )
  
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const maxAbsValue = Math.max(Math.abs(minValue), Math.abs(maxValue))
  
  // Round up to nearest even number for cleaner intervals
  const roundedMax = Math.ceil(maxAbsValue / 2) * 2 + 4
  
  // Set symmetric domain so 0 is in the middle
  const yAxisDomain = [-roundedMax, roundedMax]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{chart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={Object.keys(lineChartData[0])[0]} 
              className="text-xs" 
            />
            <YAxis 
              className="text-xs"
              domain={yAxisDomain}
              tickFormatter={(value) => `${Math.round(value)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value: any, name: string) => {
                const formatted = parseFloat(value.toFixed(2));
                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                return [`${formatted}%`, capitalizedName];
              }}
            />
            <Legend />
            {Object.keys(lineChartData[0])
              .slice(1)
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
