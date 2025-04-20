import { DocumentWithSource } from "../types/ragTypes";

// Types for tracking conversation context
interface ConversationContext {
  topic?: string;
  lastQuery?: string;
  recentTopics: string[];
  turnCount: number;
}

export class ConversationalHandler {
  private static conversationContext: ConversationContext = {
    recentTopics: [],
    turnCount: 0
  };

  // Friendly greetings with variations
  private static greetings = [
    "Hey there! I'd love to chat about",
    "Great question about",
    "Thanks for asking about",
    "I'm happy to discuss",
    "That's an interesting question about"
  ];

  // Thoughtful transitions
  private static transitions = [
    "From what I understand,",
    "Based on the Khoisan mandate,",
    "According to the information I have,",
    "The Khoisan position on this is that",
    "Looking at this issue,"
  ];

  // Engaging follow-ups to encourage conversation
  private static followUps = [
    "Would you like to know more about how this affects the community?",
    "Is there a specific aspect of this you're curious about?",
    "Does that answer your question? I'm happy to elaborate.",
    "What other aspects of the Khoisan mandate are you interested in?",
    "How does this information compare to what you've heard before?"
  ];

  // Clarification questions for unknown topics
  private static clarificationQuestions = [
    "Could you tell me more about what you're looking for regarding",
    "I'm not completely sure I understand. Could you elaborate on what you mean by",
    "That's an interesting question. To give you the best answer, could you clarify what you want to know about",
    "I'd like to help with that. Can you share more specifics about your interest in",
    "To make sure I address your question properly, could you tell me more about your interest in"
  ];

  // Topics we recognize from the Khoisan mandate
  private static knownTopics = {
    "land": ["land", "territory", "ancestral", "sovereign", "ownership"],
    "culture": ["culture", "language", "identity", "recognition", "coloured", "heritage"],
    "representation": ["representation", "parliament", "political", "voting", "governance", "veto"],
    "reparation": ["reparation", "financial", "compensation", "fund", "economic", "payment"]
  };

  // Update conversation context with new information
  public static updateContext(query: string): void {
    // Increment turn counter
    this.conversationContext.turnCount++;
    
    // Save the last query
    this.conversationContext.lastQuery = query;
    
    // Try to identify the topic
    const detectedTopic = this.detectTopic(query);
    if (detectedTopic) {
      this.conversationContext.topic = detectedTopic;
      
      // Add to recent topics if not already there
      if (!this.conversationContext.recentTopics.includes(detectedTopic)) {
        this.conversationContext.recentTopics.unshift(detectedTopic);
        
        // Keep only the 3 most recent topics
        if (this.conversationContext.recentTopics.length > 3) {
          this.conversationContext.recentTopics.pop();
        }
      }
    }
    
    console.log("Updated conversation context:", this.conversationContext);
  }

  // Detect the topic based on keywords
  private static detectTopic(query: string): string | undefined {
    const queryLower = query.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(this.knownTopics)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return topic;
      }
    }
    
    return undefined;
  }

  // Create a more conversational response using the context and documents
  public static createConversationalResponse(query: string, docs: DocumentWithSource[]): string {
    // Update conversation context
    this.updateContext(query);
    
    // If we don't have relevant documents
    if (!docs || docs.length === 0) {
      return this.createClarificationResponse(query);
    }
    
    // Use the most relevant document as the source of information
    const mainDoc = docs[0];
    
    // Construct a friendly, conversational response
    let response = '';
    
    // Add a greeting if this is the first or second turn
    if (this.conversationContext.turnCount <= 2) {
      const greeting = this.getRandomElement(this.greetings);
      const topic = this.conversationContext.topic || "the Khoisan mandate";
      response += `${greeting} ${topic}. `;
    }
    
    // Add a thoughtful transition
    response += `${this.getRandomElement(this.transitions)} `;
    
    // Extract key information from the document
    // Clean and format document text to be conversational
    let docContent = mainDoc.text;
    
    // Remove typical formal language to make it more conversational
    docContent = docContent.replace(/WE, THE KHOISAN FIRST NATIONS PEOPLE, HEREBY DECLARE:/i, "");
    docContent = docContent.replace(/This mandate is a non-negotiable assertion/i, "This is considered a non-negotiable aspect");
    
    // Transform bullet points into sentences
    docContent = docContent.replace(/•/g, "").trim();
    
    // Add the content
    response += docContent;
    
    // Add a follow-up question if this isn't the first response
    if (this.conversationContext.turnCount > 1) {
      response += ` ${this.getRandomElement(this.followUps)}`;
    }
    
    // Add source attribution
    if (mainDoc.source) {
      response += ` (Source: ${mainDoc.source})`;
    }
    
    return response;
  }

  // Create a clarification response when we don't have good information
  private static createClarificationResponse(query: string): string {
    const topic = this.conversationContext.topic || "this topic";
    const clarification = this.getRandomElement(this.clarificationQuestions);
    
    return `${clarification} ${topic}? The Khoisan mandate covers land sovereignty, cultural recognition, political representation, and financial reparation. I'd be happy to discuss any of these areas in more detail.`;
  }

  // Get a random element from an array
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Create response for specific financial reparation questions
  public static handleFinancialReparationQuery(query: string): string {
    if (query.toLowerCase().includes("financial") && query.toLowerCase().includes("reparation")) {
      return "Financial reparations in the Khoisan mandate focus on addressing historical economic injustices. This includes establishing a dedicated national fund for Khoisan community development and creating transparent mechanisms to compensate for centuries of economic marginalization and land dispossession. These reparations aim to provide resources for education, healthcare, and cultural preservation. Would you like to know more about how these funds would be allocated?";
    }
    return "";
  }

  // Create response for specific land sovereignty questions
  public static handleLandSovereigntyQuery(query: string): string {
    if (query.toLowerCase().includes("land") && 
        (query.toLowerCase().includes("sovereignty") || query.toLowerCase().includes("territory") || query.toLowerCase().includes("ancestral"))) {
      return "The Khoisan mandate calls for the unconditional return of ancestral territories. This involves complete land ownership, full mineral extraction rights, and comprehensive access to maritime resources that were historically theirs. Archaeological evidence suggests the Khoisan have inhabited Southern Africa for up to 140,000 years, making their land claims historically significant. Is there a specific aspect of land sovereignty you'd like to explore further?";
    }
    return "";
  }

  // Handle questions about cultural recognition
  public static handleCulturalRecognitionQuery(query: string): string {
    if (query.toLowerCase().includes("cultural") && query.toLowerCase().includes("recognition") ||
        query.toLowerCase().includes("language") || query.toLowerCase().includes("identity")) {
      return "Cultural recognition in the Khoisan mandate focuses on preserving identity and heritage. This includes stopping the use of colonial terms like 'coloured,' officially recognizing Khoisan languages as national languages, and implementing state-funded language preservation programs. Some Khoisan languages have fewer than 100 fluent speakers remaining, making preservation efforts urgent. What aspects of cultural preservation interest you most?";
    }
    return "";
  }

  // Handle questions about political representation
  public static handlePoliticalRepresentationQuery(query: string): string {
    if (query.toLowerCase().includes("representation") || query.toLowerCase().includes("political") || 
        query.toLowerCase().includes("parliament") || query.toLowerCase().includes("governance")) {
      return "Political representation for the Khoisan people involves direct, proportional parliamentary representation and absolute veto power on legislation affecting their territories and rights. The mandate emphasizes that no agreements, treaties, or laws should be enacted without explicit, documented Khoisan community consent. This principle of Free, Prior and Informed Consent is considered fundamental to their sovereignty. Are you interested in how this would change current governance structures?";
    }
    return "";
  }
}
