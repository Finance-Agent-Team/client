"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import { ChartRequestModal } from "./chart-request-modal"
import type { ChartData } from "@/lib/types"

export function DashboardGrid() {
  const [charts, setCharts] = useState<(ChartData | null)[]>([null, null, null, null])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  const handleAddChart = (slot: number) => {
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  const handleChartCreated = (chartData: ChartData) => {
    if (selectedSlot !== null) {
      const newCharts = [...charts]
      newCharts[selectedSlot] = chartData
      setCharts(newCharts)
    }
    setIsModalOpen(false)
    setSelectedSlot(null)
  }

  const handleRemoveChart = (slot: number) => {
    const newCharts = [...charts]
    newCharts[slot] = null
    setCharts(newCharts)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <div key={index} className="aspect-square md:aspect-[4/3]">
            {chart ? (
              <div className="relative group h-full">
                <PortfolioChart chart={chart} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveChart(index)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                  <Button
                    variant="ghost"
                    size="lg"  
                    className="h-20 w-20 rounded-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                    onClick={() => handleAddChart(index)}
                  >
                    <Plus className="h-8 w-8" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Click to add a new chart
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compare your data with market indexes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      <ChartRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSlot(null)
        }}
        onChartCreated={handleChartCreated}
      />
    </>
  )
} 