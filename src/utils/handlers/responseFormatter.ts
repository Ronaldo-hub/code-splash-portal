
import { DocumentWithSource } from "../types/ragTypes";
import { ConversationalHandler } from "./conversationalHandler";

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
You are an assistant for the Khoisan Voice initiative. Your responses should be conversational, warm, and engaging.
Avoid formal or stiff language. Use a friendly tone as if having a natural conversation.

Context information from Khoisan Voice sources:
${context}

Based on the above context, please answer the following question about the Khoisan Voice initiative in a natural, conversational way. 
Use phrases like "From what I understand," or "Based on the Khoisan position," to sound more natural.
If the information isn't provided in the context, ask a clarifying question instead of pivoting to an unrelated topic.
Keep your response concise (3-5 sentences) and end with a question to encourage further conversation.

User question: ${query}

Answer:`;
  }

  public static createConversationalResponse(query: string, docs: DocumentWithSource[]): string {
    // First check for specific topic handlers
    const financialResponse = ConversationalHandler.handleFinancialReparationQuery(query);
    if (financialResponse) return financialResponse;
    
    const landResponse = ConversationalHandler.handleLandSovereigntyQuery(query);
    if (landResponse) return landResponse;
    
    const culturalResponse = ConversationalHandler.handleCulturalRecognitionQuery(query);
    if (culturalResponse) return culturalResponse;
    
    const politicalResponse = ConversationalHandler.handlePoliticalRepresentationQuery(query);
    if (politicalResponse) return politicalResponse;
    
    // If no specific handler matched, use the general conversational handler
    return ConversationalHandler.createConversationalResponse(query, docs);
  }
}
