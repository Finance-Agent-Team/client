import { NextRequest, NextResponse } from "next/server"
import type { RelativeRotationData } from "@/lib/types"

// Helper function to convert absolute values to percentage returns
function calculatePercentageReturns(data: any[], baselineKey: string) {
  if (data.length === 0) return data
  
  const baseline = data[0][baselineKey]
  return data.map((item, index) => {
    // First data point is always 0%
    const percentReturn = index === 0 ? 0 : ((item[baselineKey] - baseline) / baseline * 100)
    return {
      ...item,
      [baselineKey]: parseFloat(percentReturn.toFixed(2))
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    let chartData
    
    // Check for relative rotation graph requests
    if (message.toLowerCase().includes("relative") || 
        message.toLowerCase().includes("rotation") ||
        message.toLowerCase().includes("sector") ||
        message.toLowerCase().includes("quadrant")) {
      chartData = {
        type: "relative-rotation" as const,
        title: "Sector Relative Rotation Analysis",
        xAxisLabel: "Relative Strength vs Benchmark",
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
      }
    } else if (message.toLowerCase().includes("s&p") || message.toLowerCase().includes("sp500")) {
      // Portfolio values in USD - Example: $50,000 starting portfolio with smaller variations
      // This represents a mid-level retail investor with modest outperformance
      const rawData = [
        { date: "Jan", portfolio: 50000, sp500: 50000 },      // Starting baseline
        { date: "Feb", portfolio: 50300, sp500: 50150 },     // $50,300 vs $50,150 (0.6% vs 0.3%)
        { date: "Mar", portfolio: 50900, sp500: 50600 },     // $50,900 vs $50,600 (1.8% vs 1.2%)
        { date: "Apr", portfolio: 50200, sp500: 50100 },     // Small dip (0.4% vs 0.2%)
        { date: "May", portfolio: 51100, sp500: 50800 },     // Recovery (2.2% vs 1.6%)
        { date: "Jun", portfolio: 51600, sp500: 51200 },     // $51,600 vs $51,200 (3.2% vs 2.4%)
        { date: "Jul", portfolio: 51400, sp500: 51000 },     // Minor pullback (2.8% vs 2.0%)
        { date: "Aug", portfolio: 51800, sp500: 51300 },     // Summer gains (3.6% vs 2.6%)
        { date: "Sep", portfolio: 52200, sp500: 51600 },     // Steady climb (4.4% vs 3.2%)
        { date: "Oct", portfolio: 52500, sp500: 51800 },     // $52,500 vs $51,800 (5.0% vs 3.6%)
        { date: "Nov", portfolio: 52800, sp500: 52000 },     // Year-end rally (5.6% vs 4.0%)
        { date: "Dec", portfolio: 53200, sp500: 52200 },     // Final: $53.2K vs $52.2K (6.4% vs 4.4%)
      ]

      // Convert to percentage returns
      const portfolioData = calculatePercentageReturns(rawData, 'portfolio')
      const sp500Data = calculatePercentageReturns(rawData, 'sp500')
      
      chartData = {
        type: "line",
        title: "Portfolio vs S&P 500 (% Returns)",
        yAxisLabel: "Return (%)",
        xAxisLabel: "Month",
        data: rawData.map((_, index) => ({
          date: rawData[index].date,
          portfolio: portfolioData[index].portfolio,
          sp500: sp500Data[index].sp500
        }))
      }
    } else if (message.toLowerCase().includes("nasdaq")) {
      // Portfolio values in USD - Example: $100,000 starting portfolio with tech focus
      // This represents a more established investor with modest tech outperformance
      const rawData = [
        { date: "Jan", portfolio: 100000, nasdaq: 100000 },  // $100K baseline
        { date: "Feb", portfolio: 100500, nasdaq: 100200 },  // $100.5K vs $100.2K (0.5% vs 0.2%)
        { date: "Mar", portfolio: 101800, nasdaq: 101400 },  // $101.8K vs $101.4K (1.8% vs 1.4%)
        { date: "Apr", portfolio: 100900, nasdaq: 100700 },  // Tech correction (0.9% vs 0.7%)
        { date: "May", portfolio: 102600, nasdaq: 102000 },  // AI/Tech recovery (2.6% vs 2.0%)
        { date: "Jun", portfolio: 103400, nasdaq: 102800 },  // $103.4K vs $102.8K (3.4% vs 2.8%)
        { date: "Jul", portfolio: 103100, nasdaq: 102500 },  // Summer volatility (3.1% vs 2.5%)
        { date: "Aug", portfolio: 103800, nasdaq: 103100 },  // Rebound (3.8% vs 3.1%)
        { date: "Sep", portfolio: 104500, nasdaq: 103700 },  // Growth continues (4.5% vs 3.7%)
        { date: "Oct", portfolio: 105200, nasdaq: 104300 },  // $105.2K vs $104.3K (5.2% vs 4.3%)
        { date: "Nov", portfolio: 105800, nasdaq: 104800 },  // Strong finish (5.8% vs 4.8%)
        { date: "Dec", portfolio: 106500, nasdaq: 105400 },  // Final: $106.5K vs $105.4K (6.5% vs 5.4%)
      ]

      const portfolioData = calculatePercentageReturns(rawData, 'portfolio')
      const nasdaqData = calculatePercentageReturns(rawData, 'nasdaq')
      
      chartData = {
        type: "line", 
        title: "Portfolio vs NASDAQ (% Returns)",
        yAxisLabel: "Return (%)",
        xAxisLabel: "Month",
        data: rawData.map((_, index) => ({
          date: rawData[index].date,
          portfolio: portfolioData[index].portfolio,
          nasdaq: nasdaqData[index].nasdaq
        }))
      }
    } else if (message.toLowerCase().includes("tech")) {
      // Portfolio values in USD - Example: $25,000 tech-focused portfolio with small variations
      // This represents a younger investor with selective tech picks
      const rawData = [
        { date: "Jan", techHoldings: 25000, techIndex: 25000 },   // $25K baseline
        { date: "Feb", techHoldings: 25150, techIndex: 25075 },   // $25.15K vs $25.075K (0.6% vs 0.3%)
        { date: "Mar", techHoldings: 25450, techIndex: 25300 },   // $25.45K vs $25.3K (1.8% vs 1.2%)
        { date: "Apr", techHoldings: 25200, techIndex: 25100 },   // Tech selloff (0.8% vs 0.4%)
        { date: "May", techHoldings: 25800, techIndex: 25600 },   // AI rally (3.2% vs 2.4%)
        { date: "Jun", techHoldings: 26100, techIndex: 25850 },   // Final: $26.1K vs $25.85K (4.4% vs 3.4%)
      ]

      const techHoldingsData = calculatePercentageReturns(rawData, 'techHoldings')
      const techIndexData = calculatePercentageReturns(rawData, 'techIndex')
      
      chartData = {
        type: "line",
        title: "Tech Holdings vs Tech Sector Index (% Returns)",
        yAxisLabel: "Return (%)",
        xAxisLabel: "Month",
        data: rawData.map((_, index) => ({
          date: rawData[index].date,
          "tech holdings": techHoldingsData[index].techHoldings,
          "tech index": techIndexData[index].techIndex
        }))
      }
    } else {
      // Portfolio values in USD - Example: $75,000 diversified portfolio with conservative gains
      // This represents a typical retail investor with modest outperformance
      const rawData = [
        { date: "Jan", portfolio: 75000, benchmark: 75000 },    // $75K baseline
        { date: "Feb", portfolio: 75450, benchmark: 75300 },    // $75.45K vs $75.3K (0.6% vs 0.4%)
        { date: "Mar", portfolio: 76200, benchmark: 75900 },    // $76.2K vs $75.9K (1.6% vs 1.2%)
        { date: "Apr", portfolio: 75800, benchmark: 75600 },    // Market correction (1.1% vs 0.8%)
        { date: "May", portfolio: 77100, benchmark: 76500 },    // Recovery (2.8% vs 2.0%)
        { date: "Jun", portfolio: 77850, benchmark: 77200 },    // Final: $77.85K vs $77.2K (3.8% vs 2.9%)
      ]

      const portfolioData = calculatePercentageReturns(rawData, 'portfolio')
      const benchmarkData = calculatePercentageReturns(rawData, 'benchmark')
      
      chartData = {
        type: "line",
        title: "Portfolio Performance Analysis (% Returns)",
        yAxisLabel: "Return (%)",
        xAxisLabel: "Month",
        data: rawData.map((_, index) => ({
          date: rawData[index].date,
          portfolio: portfolioData[index].portfolio,
          benchmark: benchmarkData[index].benchmark
        }))
      }
    }

    const response = chartData.type === "relative-rotation" 
      ? `I've created a relative rotation graph showing sector performance analysis. This quadrant chart helps visualize which sectors are in leading, improving, weakening, or lagging phases based on their relative strength and momentum.`
      : `I've analyzed your request and created a chart comparing performance as percentage returns. The chart starts at 0% and shows relative profitability over time.`

    return NextResponse.json({
      response,
      chartData
    })

  } catch (error) {
    console.error("Chart request error:", error)
    return NextResponse.json(
      { error: "Failed to process chart request" },
      { status: 500 }
    )
  }
} 