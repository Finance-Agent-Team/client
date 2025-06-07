/**
 * API Service for connecting to the PydanticAI Stock Analysis Server
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  name?: string;
  risk_tolerance?: "conservative" | "moderate" | "aggressive";
  investment_horizon?: "short" | "medium" | "long";
  email?: string;
}

export interface StockAnalysisRequest {
  symbol: string;
  user_profile?: UserProfile;
}

export interface MarketConditions {
  sentiment: "bullish" | "bearish" | "neutral";
  volatility: "high" | "medium" | "low";
  trend: "upward" | "downward" | "sideways";
  confidence: number;
}

export interface StockDataPoint {
  date: string;
  symbol: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  daily_change?: number;
  daily_change_pct?: number;
}

export interface AnalysisResult {
  symbol: string;
  recommendation: "buy" | "hold" | "sell";
  confidence: number;
  target_price?: number;
  stop_loss?: number;
  reasoning: string;
  market_conditions: MarketConditions;
  data_points: StockDataPoint[];
  analysis_timestamp: string;
}

export interface StockAnalysisResponse {
  success: boolean;
  analysis_result?: AnalysisResult;
  error_message?: string;
  execution_time_seconds?: number;
}

export interface WorkflowDiagram {
  mermaid_diagram: string;
  description: string;
}

export class StockAnalysisAPI {
  /**
   * Perform comprehensive stock analysis using PydanticAI Graph workflow
   */
  static async analyzeStock(
    request: StockAnalysisRequest
  ): Promise<StockAnalysisResponse> {
    try {
      const response = await fetch(`${API_URL}/stock-analysis/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Stock analysis error:", error);
      return {
        success: false,
        error_message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get the workflow diagram for the PydanticAI graph
   */
  static async getWorkflowDiagram(): Promise<WorkflowDiagram | null> {
    try {
      const response = await fetch(
        `${API_URL}/stock-analysis/workflow-diagram`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get workflow diagram:", error);
      return null;
    }
  }

  /**
   * Get analysis steps for a symbol
   */
  static async getAnalysisSteps(symbol: string): Promise<{
    success: boolean;
    steps?: string[];
    mermaid_diagram?: string;
    error_message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_URL}/stock-analysis/workflow-steps/${symbol}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get analysis steps:", error);
      return {
        success: false,
        error_message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Check service health
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/stock-analysis/health`);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

/**
 * OCR Service for document analysis
 */
export class OCRService {
  private static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  /**
   * Extract text from image using OpenAI Vision API
   */
  static async extractTextFromImage(imageBase64: string): Promise<{
    success: boolean;
    text?: string;
    error?: string;
  }> {
    if (!this.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured",
      };
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Extract all text from this image. Return only the extracted text.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${imageBase64}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 4096,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        text: data.choices[0].message.content,
      };
    } catch (error) {
      console.error("OCR extraction error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
