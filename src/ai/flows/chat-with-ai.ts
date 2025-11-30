'use server';

/**
 * @fileOverview A flow that allows a doctor to chat with an AI assistant about a patient's case.
 *
 * - chatWithAI - A function that handles the chat with AI process.
 * - ChatWithAIInput - The input type for the chatWithAI function.
 * - ChatWithAIOutput - The return type for the chatWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAIInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  message: z.string().describe('The message from the doctor.'),
});
export type ChatWithAIInput = z.infer<typeof ChatWithAIInputSchema>;

const ChatWithAIOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type ChatWithAIOutput = z.infer<typeof ChatWithAIOutputSchema>;

export async function chatWithAI(input: ChatWithAIInput): Promise<ChatWithAIOutput> {
  return chatWithAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithAIPrompt',
  input: {schema: ChatWithAIInputSchema},
  output: {schema: ChatWithAIOutputSchema},
  prompt: `You are an AI assistant helping doctors with patient cases.

  You have access to the patient's medical history and current vitals.
  Use this information to provide insights and support the doctor in making clinical decisions.

  Patient ID: {{{patientId}}}
  Doctor Message: {{{message}}}
  Response:`, // Removed media url, as no images should be present.
});

const chatWithAIFlow = ai.defineFlow(
  {
    name: 'chatWithAIFlow',
    inputSchema: ChatWithAIInputSchema,
    outputSchema: ChatWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
