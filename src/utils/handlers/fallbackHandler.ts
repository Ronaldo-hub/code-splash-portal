
import { DocumentWithSource } from "../types/ragTypes";

export class FallbackHandler {
  public static getContextualFallback(query: string): string {
    const queryLower = query.toLowerCase();
    
    // Mandate-specific fallbacks
    if (queryLower.includes("mandate") || queryLower.includes("vote")) {
      return "The Khoisan mandate focuses on four key pillars: land sovereignty, cultural recognition, political representation, and financial reparation. Each addresses historical injustices faced by the indigenous Khoisan people. Which aspect would you like to explore further?";
    }
    
    if (queryLower.includes('help') || queryLower.includes('support')) {
      return "I'm here to help you understand how to support the Khoisan mandate. We focus on four key areas: land sovereignty, cultural recognition, political representation, and financial reparation. Which aspect would you like to learn more about?";
    }
    
    if (queryLower.includes('thank') || queryLower.includes('thanks')) {
      return "You're welcome! Your interest in supporting the Khoisan First Nations mandate is appreciated. Is there anything else you'd like to know about our cause?";
    }
    
    return "While I don't have specific information about that particular question, I'd be happy to tell you about the Khoisan mandate's key pillars: land sovereignty, cultural recognition, political representation, and financial reparation. Which interests you most? You can also learn more at https://khoisanvoice.carrd.co/";
  }

  public static getFallbackResponse(query: string, docs: DocumentWithSource[]): string {
    const queryLower = query.toLowerCase();
    
    // Special handling for mandate-related questions
    if (queryLower.includes("mandate") || queryLower.includes("vote")) {
      return "The Khoisan mandate is a comprehensive framework with four pillars: (1) Land Sovereignty - returning ancestral territories with full land ownership, mineral and maritime rights, (2) Cultural Recognition - preserving endangered languages and ending colonial classifications, (3) Political Representation - ensuring direct parliamentary representation and veto power on legislation affecting Khoisan territories, and (4) Financial Reparation - establishing mechanisms for economic justice. Which aspect would you like to learn more about?";
    }
    
    if (queryLower.includes("land") || queryLower.includes("sovereignty")) {
      return "Supporting the Khoisan mandate on land sovereignty is crucial as it seeks to restore ancestral territories that were unjustly taken during colonization. This includes complete land ownership, mineral rights, and maritime resource access. Land sovereignty is fundamental to the Khoisan people's cultural survival and economic independence. Join us in advocating for this historical justice! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("culture") || queryLower.includes("language") || queryLower.includes("recognition")) {
      return "Supporting the Khoisan cultural recognition mandate is essential because it aims to preserve endangered languages with fewer than 100 speakers remaining and eliminate colonial classifications that erase indigenous identity. Cultural recognition ensures the preservation of ancient knowledge and traditions for future generations. Together, we can help revitalize this irreplaceable heritage! (Source: https://khoisanvoice.carrd.co/)";
    }
    
    if (queryLower.includes("representation") || queryLower.includes("parliament") || queryLower.includes("political")) {
      return "The Khoisan political representation mandate deserves support because it calls for direct proportional parliamentary representation and veto power on legislation affecting Khoisan territories. Despite constitutional recognition in some countries, practical implementation of Khoisan rights remains severely limited. Your advocacy helps ensure indigenous voices are heard in decisions that affect their future! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("financial") || queryLower.includes("reparation") || queryLower.includes("compensation")) {
      return "Supporting the financial reparation mandate is important as it establishes mechanisms to address centuries of economic injustice against the Khoisan people. This includes a dedicated national fund for community development and transparent compensation for historical damages. Economic justice is a crucial step toward healing and rebuilding. Stand with us in this vital cause! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("support") || queryLower.includes("important") || queryLower.includes("why")) {
      return "Supporting the Khoisan mandate is crucial because it addresses historical injustices against indigenous people who have lived in Southern Africa for 140,000 years but faced land dispossession, cultural erasure, and systematic marginalization. The mandate seeks to restore land sovereignty, cultural recognition, political representation, and economic justice through reparations. By supporting this cause, you contribute to healing historical wounds and creating a more just society. Join us in this important movement for indigenous rights! (Source: Khoisan Mandate)";
    }
    
    return "The Khoisan mandate represents a comprehensive approach to addressing historical injustices faced by the indigenous people of Southern Africa. It covers land sovereignty, cultural recognition, political representation, and financial reparation. Supporting this mandate helps promote justice, dignity, and self-determination for a people whose rights have been systematically violated for centuries. Learn more at https://khoisanvoice.carrd.co/ and join our movement for indigenous rights!";
  }
}
