"use client";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            AI-Powered Risk Analysis
          </DialogTitle>
          <DialogDescription>
            This is an automated assessment based on patient history. For
            clinical use only.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-6 p-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">
                Risk Assessment for {patientName}
              </h3>
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
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-2" />
                </div>
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
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
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {analysisResult.primaryRiskFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <ListChecks className="h-5 w-5 text-primary" />
                      Supporting Evidence
                    </h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {analysisResult.supportingEvidence.map((evidence, i) => (
                        <li key={i}>{evidence}</li>
                      ))}
                    </ul>
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
