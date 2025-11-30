'use server';

/**
 * @fileOverview An AI agent to generate a summary of a patient's medical history.
 *
 * - generatePatientSummary - A function that handles the patient summary generation process.
 * - GeneratePatientSummaryInput - The input type for the generatePatientSummary function.
 * - GeneratePatientSummaryOutput - The return type for the generatePatientSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePatientSummaryInputSchema = z.object({
  patientHistory: z.string().describe('The medical history of the patient.'),
});
export type GeneratePatientSummaryInput = z.infer<typeof GeneratePatientSummaryInputSchema>;

const GeneratePatientSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the patient medical history.'),
});
export type GeneratePatientSummaryOutput = z.infer<typeof GeneratePatientSummaryOutputSchema>;

export async function generatePatientSummary(input: GeneratePatientSummaryInput): Promise<GeneratePatientSummaryOutput> {
  return generatePatientSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePatientSummaryPrompt',
  input: {schema: GeneratePatientSummaryInputSchema},
  output: {schema: GeneratePatientSummaryOutputSchema},
  prompt: `You are an expert medical professional. Generate a concise summary of the following patient medical history:\n\nPatient History: {{{patientHistory}}}`,
});

const generatePatientSummaryFlow = ai.defineFlow(
  {
    name: 'generatePatientSummaryFlow',
    inputSchema: GeneratePatientSummaryInputSchema,
    outputSchema: GeneratePatientSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
