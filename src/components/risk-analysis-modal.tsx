
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { AIRiskAnalysisOutput } from "@/ai/flows/ai-risk-analysis";
import { HeartPulse, ListChecks, Wand2, RefreshCw } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface RiskAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AIRiskAnalysisOutput | null;
  patientName: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function RiskAnalysisModal({
  isOpen,
  onClose,
  analysisResult,
  patientName,
  isLoading,
  onRegenerate,
}: RiskAnalysisModalProps) {
  const getRiskLevelVariant = (
    level: "High" | "Medium" | "Low" | undefined
  ) => {
    switch (level) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "default";
    }
  };

  const chartData = analysisResult?.riskFactors || [];
  const chartConfig = {
    score: {
      label: "Score",
    },
  };

  const fillByScore = (score: number) => {
    if (score > 75) return "hsl(var(--destructive))";
    if (score > 50) return "hsl(var(--secondary))";
    return "hsl(var(--primary))";
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            Risk Analysis for {patientName}
          </DialogTitle>
          <DialogDescription>
            This is an automated assessment based on patient history. For
            clinical use only.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="flex-1 min-h-0 pr-6 -mr-6">
          <div className="space-y-6 p-1">
            <div className="flex justify-between items-center">
               {isLoading ? (
                <Skeleton className="h-8 w-28 rounded-full" />
              ) : (
                analysisResult && (
                  <Badge
                    variant={getRiskLevelVariant(analysisResult.riskLevel)}
                    className="text-base px-4 py-1"
                  >
                    Risk Level: {analysisResult.riskLevel}
                  </Badge>
                )
              )}
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-8 mt-4">
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-56 w-full" />
                </div>
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-2" />
                </div>
              </div>
            ) : (
              analysisResult && (
                <div className="grid md:grid-cols-2 gap-8 mt-4">
                  <div className="space-y-2">
                     <h4 className="flex items-center gap-2 font-semibold">
                      <HeartPulse className="h-5 w-5 text-primary" />
                      Primary Risk Factors
                    </h4>
                    {chartData.length > 0 ? (
                       <ChartContainer config={chartConfig} className="h-56 w-full">
                        <ResponsiveContainer>
                          <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ left: 10, right: 30 }}
                          >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                              dataKey="factor"
                              type="category"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12 }}
                              width={100}
                              className="capitalize"
                            />
                            <XAxis dataKey="score" type="number" hide />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="score" radius={4}>
                              <LabelList dataKey="score" position="right" offset={8} className="fill-foreground" fontSize={12} />
                              {chartData.map((entry, index) => (
                                <rect key={`cell-${index}`} fill={fillByScore(entry.score)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                       <p className="text-muted-foreground text-sm">No risk factors identified.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <ListChecks className="h-5 w-5 text-primary" />
                      Factor Details
                    </h4>
                    <ScrollArea className="h-56">
                      <ul className="space-y-3 pr-4">
                        {analysisResult.riskFactors.map((factor, i) => (
                          <li key={i} className="text-sm">
                            <strong className="capitalize">{factor.factor} ({factor.score}):</strong>
                            <span className="text-muted-foreground ml-1">{factor.description}</span>
                            </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </div>
              )
            )}

            {isLoading ? (
              <div className="mt-6">
                <Skeleton className="h-6 w-56 mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              analysisResult && (
                <div className="space-y-2 mt-6">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Actionable Recommendation
                  </h4>
                  <div className="bg-muted/50 p-4 rounded-md text-foreground">
                    {analysisResult.actionableRecommendation}
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="sm:justify-between pt-4">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate Analysis
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
