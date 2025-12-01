'use server';

/**
 * @fileOverview Implements the AI-powered risk analysis flow for patients.
 *
 * - aiRiskAnalysis - A function that triggers the AI risk analysis process.
 * - AIRiskAnalysisInput - The input type for the aiRiskAnalysis function.
 * - AIRiskAnalysisOutput - The return type for the aiRiskAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIRiskAnalysisInputSchema = z.object({
  patientMedicalHistory: z
    .string()
    .describe('The patient medical history, including vitals and lab reports.'),
  consentGiven: z
    .boolean()
    .describe(
      'Whether the patient has given consent for AI analysis of their data.'
    ),
});
export type AIRiskAnalysisInput = z.infer<typeof AIRiskAnalysisInputSchema>;

const RiskFactorScoreSchema = z.object({
  factor: z.string().describe('The name of the risk factor (e.g., "Hypertension").'),
  score: z.number().describe('A numerical score from 0 to 100 representing the contribution of this factor to the overall risk.'),
  description: z.string().describe('A brief explanation of why this factor is a risk.'),
});

const AIRiskAnalysisOutputSchema = z.object({
  riskLevel: z.enum(['High', 'Medium', 'Low']).describe('The overall assessed risk level.'),
  riskFactors: z.array(RiskFactorScoreSchema).describe('A list of primary risk factors and their individual scores.'),
  actionableRecommendation: z
    .string()
    .describe('An actionable recommendation based on the risk analysis.'),
  modelVersion: z.string().describe('The model version used for the analysis.'),
  timestamp: z.string().describe('The timestamp of the analysis.'),
});
export type AIRiskAnalysisOutput = z.infer<typeof AIRiskAnalysisOutputSchema>;

export async function aiRiskAnalysis(
  input: AIRiskAnalysisInput
): Promise<AIRiskAnalysisOutput> {
  return aiRiskAnalysisFlow(input);
}

const aiRiskAnalysisPrompt = ai.definePrompt({
  name: 'aiRiskAnalysisPrompt',
  input: {schema: AIRiskAnalysisInputSchema},
  output: {schema: AIRiskAnalysisOutputSchema},
  prompt: `You are an AI assistant designed to analyze patient medical history and identify potential risks.

  Analyze the following patient medical history, vitals, and lab reports to determine the risk level, primary risk factors with scores, and actionable recommendations.

  Patient Medical History:
  {{#if consentGiven}}
  {{{patientMedicalHistory}}}
  {{else}}
  Patient data cannot be accessed without consent.
  {{/if}}

  Provide the output in JSON format. The risk factor scores should be between 0 and 100.
  `,
});

const aiRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'aiRiskAnalysisFlow',
    inputSchema: AIRiskAnalysisInputSchema,
    outputSchema: AIRiskAnalysisOutputSchema,
  },
  async input => {
    if (!input.consentGiven) {
      return {
        riskLevel: 'Low',
        riskFactors: [],
        actionableRecommendation: 'Patient consent is required for risk analysis.',
        modelVersion: 'N/A',
        timestamp: new Date().toISOString(),
      };
    }
    const {output} = await aiRiskAnalysisPrompt(input);
    return output!;
  }
);
