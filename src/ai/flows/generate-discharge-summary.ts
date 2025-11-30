'use server';

/**
 * @fileOverview An AI agent to generate a discharge summary for a patient.
 *
 * - generateDischargeSummary - A function that handles the patient discharge summary generation process.
 * - GenerateDischargeSummaryInput - The input type for the generateDischargeSummary function.
 * - GenerateDischargeSummaryOutput - The return type for the generateDischargeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDischargeSummaryInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  admissionDate: z.string().describe('The date of admission.'),
  dischargeDate: z.string().describe('The date of discharge.'),
  medicalHistory: z
    .string()
    .describe('The comprehensive medical history of the patient for this admission.'),
});
export type GenerateDischargeSummaryInput = z.infer<
  typeof GenerateDischargeSummaryInputSchema
>;

const GenerateDischargeSummaryOutputSchema = z.object({
  patientName: z.string().describe("The patient's full name."),
  admissionDate: z.string().describe('Date of admission.'),
  dischargeDate: z.string().describe('Date of discharge.'),
  reasonForAdmission: z
    .string()
    .describe('The primary reason for the hospital admission.'),
  treatmentSummary: z
    .string()
    .describe('A summary of the treatment and procedures performed.'),
  dischargeCondition: z
    .string()
    .describe("The patient's condition at the time of discharge."),
  followUpInstructions: z
    .string()
    .describe('Instructions for follow-up care, including appointments and medications.'),
  attendingPhysician: z.string().describe('The name of the attending physician.'),
});
export type GenerateDischargeSummaryOutput = z.infer<
  typeof GenerateDischargeSummaryOutputSchema
>;

export async function generateDischargeSummary(
  input: GenerateDischargeSummaryInput
): Promise<GenerateDischargeSummaryOutput> {
  return generateDischargeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDischargeSummaryPrompt',
  input: {schema: GenerateDischargeSummaryInputSchema},
  output: {schema: GenerateDischargeSummaryOutputSchema},
  prompt: `You are a medical scribe responsible for creating a patient discharge summary. Using the provided information, generate a clear, concise, and structured discharge summary.

Patient Name: {{{patientName}}}
Admission Date: {{{admissionDate}}}
Discharge Date: {{{dischargeDate}}}
Attending Physician: Dr. Priya Sharma

Medical History & Hospital Course:
{{{medicalHistory}}}

Generate a discharge summary with the following fields:
- reasonForAdmission
- treatmentSummary
- dischargeCondition
- followUpInstructions
`,
});

const generateDischargeSummaryFlow = ai.defineFlow(
  {
    name: 'generateDischargeSummaryFlow',
    inputSchema: GenerateDischargeSummaryInputSchema,
    outputSchema: GenerateDischargeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      patientName: input.patientName,
      admissionDate: input.admissionDate,
      dischargeDate: input.dischargeDate,
      attendingPhysician: 'Dr. Priya Sharma', // Hardcoded for demo
    };
  }
);
