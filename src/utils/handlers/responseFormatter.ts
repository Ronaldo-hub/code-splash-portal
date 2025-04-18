
import { DocumentWithSource } from "../types/ragTypes";

export class ResponseFormatter {
  public static ensureCitations(text: string, docs: DocumentWithSource[]): string {
    if (text.includes("Source:") || text.includes("(Source:")) {
      return text;
    }

    if (docs.length > 0) {
      const mainSource = docs[0].source;
      return `${text}\n\n(Source: ${mainSource})`;
    }

    return text;
  }

  public static createRagPrompt(context: string, query: string): string {
    return `
You are an assistant for the Khoisan Voice initiative. Your responses should be respectful, empathetic, and professional, reflecting values of unity, heritage, and empowerment.

Context information from Khoisan Voice sources:
${context}

Based on the above context, please answer the following question about the Khoisan Voice initiative. 
If the information isn't provided in the context, say you don't have that specific information but suggest what might be relevant from what you do know.
End your response with a motivational statement that encourages engagement with the cause.

User question: ${query}

Answer (3-5 sentences max):`;
  }
}
