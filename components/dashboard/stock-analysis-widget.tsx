"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  GitBranch,
} from "lucide-react";
import {
  StockAnalysisAPI,
  type AnalysisResult,
  type UserProfile,
} from "@/lib/api-service";

export function StockAnalysisWidget() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workflowDiagram, setWorkflowDiagram] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analysis");

  // User profile state
  const [riskTolerance, setRiskTolerance] =
    useState<UserProfile["risk_tolerance"]>("moderate");
  const [investmentHorizon, setInvestmentHorizon] =
    useState<UserProfile["investment_horizon"]>("medium");

  // Load workflow diagram on component mount
  useEffect(() => {
    loadWorkflowDiagram();
  }, []);

  const loadWorkflowDiagram = async () => {
    const diagram = await StockAnalysisAPI.getWorkflowDiagram();
    if (diagram) {
      setWorkflowDiagram(diagram.mermaid_diagram);
    }
  };

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      setError("Please enter a stock symbol");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    const userProfile: UserProfile = {
      risk_tolerance: riskTolerance,
      investment_horizon: investmentHorizon,
    };

    const response = await StockAnalysisAPI.analyzeStock({
      symbol: symbol.toUpperCase(),
      user_profile: userProfile,
    });

    setLoading(false);

    if (response.success && response.analysis_result) {
      setAnalysis(response.analysis_result);
      setActiveTab("analysis");
    } else {
      setError(response.error_message || "Analysis failed");
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "sell":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-100 text-green-800";
      case "bearish":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          AI Stock Analysis - PydanticAI Graph
        </CardTitle>
        <CardDescription>
          Comprehensive stock analysis using multi-stage AI workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Risk Tolerance
              </label>
              <Select
                value={riskTolerance}
                onValueChange={(v) => setRiskTolerance(v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Investment Horizon
              </label>
              <Select
                value={investmentHorizon}
                onValueChange={(v) => setInvestmentHorizon(v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Term</SelectItem>
                  <SelectItem value="medium">Medium Term</SelectItem>
                  <SelectItem value="long">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
            <TabsTrigger value="workflow">
              <GitBranch className="w-4 h-4 mr-2" />
              Workflow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {analysis && (
              <>
                {/* Recommendation Card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getRecommendationIcon(analysis.recommendation)}
                      <span className="text-lg font-semibold uppercase">
                        {analysis.recommendation}
                      </span>
                    </div>
                    <Badge variant="outline">
                      Confidence: {(analysis.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  {analysis.target_price && (
                    <div className="text-sm text-gray-600">
                      Target Price: ${analysis.target_price.toFixed(2)}
                      {analysis.stop_loss &&
                        ` | Stop Loss: $${analysis.stop_loss.toFixed(2)}`}
                    </div>
                  )}
                </div>

                {/* Market Conditions */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Sentiment</div>
                    <Badge
                      className={getSentimentColor(
                        analysis.market_conditions.sentiment
                      )}
                    >
                      {analysis.market_conditions.sentiment}
                    </Badge>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Volatility</div>
                    <Badge variant="outline">
                      {analysis.market_conditions.volatility}
                    </Badge>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Trend</div>
                    <Badge variant="outline">
                      {analysis.market_conditions.trend}
                    </Badge>
                  </div>
                </div>

                {/* Analysis Reasoning */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Analysis Summary</h4>
                  <p className="text-sm text-gray-600">{analysis.reasoning}</p>
                </div>

                {/* Data Points Summary */}
                {analysis.data_points.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Analyzed {analysis.data_points.length} data points • Latest:
                    $
                    {analysis.data_points[
                      analysis.data_points.length - 1
                    ].close_price.toFixed(2)}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">PydanticAI Graph Workflow</h4>
              <p className="text-sm text-gray-600 mb-4">
                The analysis uses a 5-stage AI pipeline with state management:
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">DataCollection</span> - MCP data
                  retrieval
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">TechnicalAnalysis</span> - Price
                  patterns & indicators
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">FundamentalAnalysis</span> -
                  Company financials
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">SentimentAnalysis</span> -
                  Market sentiment
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">FinalRecommendation</span> -
                  Investment decision
                </div>
              </div>
            </div>

            {workflowDiagram && (
              <div className="border rounded-lg p-4 bg-white">
                <pre className="text-xs overflow-x-auto">{workflowDiagram}</pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
