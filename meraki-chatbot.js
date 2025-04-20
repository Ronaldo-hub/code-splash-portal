/**
 * Khoisan Voice Conversational Chatbot for Meraki Portal
 * 
 * A natural-sounding chatbot that provides information about the Khoisan mandate
 * with a focus on land sovereignty, cultural recognition, political representation,
 * and financial reparation. Uses session storage to maintain conversation context.
 */

// Configuration for the chatbot
const CHATBOT_CONFIG = {
  // UI settings
  uiConfig: {
    position: 'bottom-right',
    primaryColor: '#60270E',
    secondaryColor: '#7A3413',
    fontFamily: 'Arial, sans-serif',
    botName: 'Khoisan Voice Assistant',
    welcomeMessage: "Hello! I'm here to help you learn about the Khoisan First Nations mandate. Ask me about land sovereignty, cultural recognition, political representation, or financial reparation. How can I assist you today?"
  },
  
  // Conversation memory
  memoryKey: 'khoisan_chat_history',
  maxMemoryItems: 5,
  
  // Knowledge base for key Khoisan mandate topics
  knowledgeBase: {
    'land_sovereignty': {
      keywords: ['land', 'territory', 'ancestral', 'sovereign', 'ownership'],
      response: "The Khoisan mandate calls for the unconditional return of ancestral territories. This includes complete land ownership, mineral rights, and access to maritime resources that were historically theirs. Archaeological evidence suggests the Khoisan have lived in Southern Africa for up to 140,000 years, making their land claims historically significant. Would you like to know more about the territories involved or how this sovereignty would work in practice?"
    },
    'cultural_recognition': {
      keywords: ['culture', 'language', 'identity', 'recognition', 'coloured', 'heritage'],
      response: "Cultural recognition in the Khoisan mandate focuses on preserving their identity and heritage. This includes stopping the use of colonial terms like 'coloured,' officially recognizing Khoisan languages as national languages, and implementing preservation programs. Some Khoisan languages have fewer than 100 fluent speakers left, making these efforts particularly urgent. What aspect of cultural preservation interests you most?"
    },
    'political_representation': {
      keywords: ['representation', 'parliament', 'political', 'voting', 'governance', 'veto'],
      response: "Political representation for the Khoisan involves direct parliamentary representation and veto power on legislation affecting their territories and rights. The mandate emphasizes that no laws should be enacted without explicit Khoisan community consent - a principle of Free, Prior and Informed Consent. How do you feel this would change current governance structures?"
    },
    'financial_reparation': {
      keywords: ['reparation', 'financial', 'compensation', 'fund', 'economic', 'payment'],
      response: "Financial reparations for the Khoisan mandate focus on addressing historical injustices through economic compensation. This includes establishing community development funds, providing resource rights, and creating transparent mechanisms to compensate for centuries of economic marginalization and land dispossession. These funds would support education, healthcare, and cultural preservation. Are you interested in how these reparations might be implemented?"
    },
    'wifi_connection': {
      keywords: ['wifi', 'connect', 'internet', 'connection', 'login', 'email', 'sign'],
      response: "To connect to the Khoisan Voice Wi-Fi network, simply enter your email address and name in the form above, then click 'Connect to Wi-Fi'. This is a free service while you're learning about the Khoisan mandate. Is there anything specific about the Khoisan First Nations you'd like to know while you're connected?"
    }
  },
  
  // Clarification responses when no specific topic is detected
  clarificationResponses: [
    "I'd be happy to tell you about the Khoisan mandate. Could you specify which aspect interests you most - land sovereignty, cultural recognition, political representation, or financial reparation?",
    "The Khoisan mandate covers several important areas. To give you the most helpful information, could you tell me which aspect you're curious about?",
    "I'm here to share information about the Khoisan First Nations mandate. Would you like to know about land rights, cultural identity, political representation, or financial reparations?"
  ],
  
  // Follow-up questions to encourage conversation
  followUpQuestions: [
    "Is there something specific about that you'd like to know more about?",
    "Does that answer your question? I'm happy to elaborate further.",
    "What other aspects of the Khoisan mandate interest you?",
    "How does this information relate to your understanding of indigenous rights?",
    "Would you like to learn about another aspect of the Khoisan mandate?"
  ]
};

// Chat state management
let chatWindow;
let chatInput;
let chatMessages;
let isChatOpen = false;
let conversationContext = {
  history: [],
  currentTopic: null
};

// Load chat history from session storage
function loadChatHistory() {
  const savedHistory = sessionStorage.getItem(CHATBOT_CONFIG.memoryKey);
  if (savedHistory) {
    try {
      conversationContext.history = JSON.parse(savedHistory);
      
      // Restore the current topic if available
      const lastUserMessage = conversationContext.history
        .filter(msg => msg.sender === 'user')
        .pop();
        
      if (lastUserMessage) {
        conversationContext.currentTopic = detectTopic(lastUserMessage.text);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      conversationContext.history = [];
    }
  }
}

// Save chat history to session storage
function saveChatHistory() {
  try {
    // Only keep the last N messages to prevent storage issues
    const historyToSave = conversationContext.history
      .slice(-CHATBOT_CONFIG.maxMemoryItems * 2);
      
    sessionStorage.setItem(
      CHATBOT_CONFIG.memoryKey, 
      JSON.stringify(historyToSave)
    );
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

// Detect the topic based on keywords in user input
function detectTopic(userInput) {
  const inputLower = userInput.toLowerCase();
  
  for (const [topic, data] of Object.entries(CHATBOT_CONFIG.knowledgeBase)) {
    for (const keyword of data.keywords) {
      if (inputLower.includes(keyword)) {
        return topic;
      }
    }
  }
  
  return null;
}

// Get a personalized response based on conversation context
function getResponse(userInput) {
  // Detect the topic from user input
  const detectedTopic = detectTopic(userInput);
  
  // Update conversation context
  if (detectedTopic) {
    conversationContext.currentTopic = detectedTopic;
  }
  
  // If we detected a topic, return the knowledge base response
  if (detectedTopic && CHATBOT_CONFIG.knowledgeBase[detectedTopic]) {
    return CHATBOT_CONFIG.knowledgeBase[detectedTopic].response;
  }
  
  // Multi-turn conversation handling
  if (conversationContext.currentTopic && conversationContext.history.length > 1) {
    // If we're in a conversation about a specific topic, but the new message
    // doesn't clearly match a topic, continue with the current topic
    const currentTopicData = CHATBOT_CONFIG.knowledgeBase[conversationContext.currentTopic];
    
    if (userInput.toLowerCase().includes('yes') || 
        userInput.toLowerCase().includes('tell me more') ||
        userInput.toLowerCase().includes('more information')) {
      
      // User wants more information about the current topic
      if (conversationContext.currentTopic === 'land_sovereignty') {
        return "The Khoisan land sovereignty claim is based on archaeological and historical evidence of continuous habitation. The mandate calls for formal recognition through constitutional amendments and international law mechanisms. This includes the right to control development, manage natural resources, and preserve cultural sites on these lands. Does this address what you wanted to know about land sovereignty?";
      } 
      else if (conversationContext.currentTopic === 'cultural_recognition') {
        return "Cultural recognition for the Khoisan includes establishing cultural centers in major cities, incorporating Khoisan history into educational curricula, and funding research to document and preserve traditional knowledge. Many Khoisan cultural practices contain valuable ecological wisdom developed over millennia. Would you like to know about specific cultural preservation initiatives?";
      }
      else if (conversationContext.currentTopic === 'political_representation') {
        return "Political representation in the Khoisan mandate would involve creating designated seats in national parliament, establishing consultative councils at provincial and local levels, and including Khoisan representatives in environmental policy decisions. It emphasizes a transition from tokenistic consultation to meaningful participation in governance. How do you think this would affect current political structures?";
      }
      else if (conversationContext.currentTopic === 'financial_reparation') {
        return "Financial reparations would include calculating the economic impact of historical land dispossession, establishing trust funds managed by Khoisan representatives, creating scholarships for Khoisan youth, and investing in Khoisan-owned businesses. Some proposals suggest royalties from resources extracted from ancestral territories. Is there a specific aspect of these financial mechanisms you'd like to explore?";
      }
      else if (conversationContext.currentTopic === 'wifi_connection') {
        return "Once you've connected to the Wi-Fi by submitting the form, you'll have full internet access. While you browse, I encourage you to check out https://khoisanvoice.carrd.co/ for more information about the Khoisan mandate. Is there anything specific about the Wi-Fi connection process you're having trouble with?";
      }
    }
    
    // Check if the question is about specifics of the current topic
    if (userInput.toLowerCase().includes('how') || 
        userInput.toLowerCase().includes('what') || 
        userInput.toLowerCase().includes('why') ||
        userInput.toLowerCase().includes('when') ||
        userInput.toLowerCase().includes('who')) {
      
      if (conversationContext.currentTopic === 'land_sovereignty') {
        return "The Khoisan land sovereignty mandate proposes implementation through formal territory mapping projects, legal recognition via constitutional courts, and international advocacy at forums like the UN. It emphasizes that sovereignty includes both surface rights and subsurface resource rights, which have often been separated under colonial legal systems. Does that help answer your question about land sovereignty?";
      }
      else if (conversationContext.currentTopic === 'cultural_recognition') {
        return "Cultural recognition would be implemented through national language institutes, community-led documentation projects, and formal processes to correct historical records. The Khoisan have rich traditions of rock art, storytelling, and ecological knowledge that are at risk of being lost without these interventions. Would you like to know more about any of these specific cultural elements?";
      }
      else if (conversationContext.currentTopic === 'political_representation') {
        return "The political representation framework would create a dual governance structure that respects both modern democratic processes and traditional Khoisan decision-making. This includes recognized councils of elders alongside elected representatives. The mandate argues this approach would create more nuanced and just governance. Does that clarify how political representation would work?";
      }
      else if (conversationContext.currentTopic === 'financial_reparation') {
        return "Financial reparations would be implemented through dedicated legislation establishing a national reconciliation fund, direct community investments, and economic development zones in historically Khoisan territories. Some proposals include tax incentives for businesses partnering with Khoisan communities. Implementation would be monitored by an independent commission with Khoisan representation. Does that address what you wanted to know?";
      }
    }
  }
  
  // If we can't determine a good context-aware response, use a clarification
  return getRandomElement(CHATBOT_CONFIG.clarificationResponses);
}

// Add a message to the chat window
function addMessage(text, sender) {
  if (!chatMessages) return;
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.classList.add(`${sender}-message`);
  
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = text;
  
  messageElement.appendChild(messageContent);
  chatMessages.appendChild(messageElement);
  
  // Auto-scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Add to conversation history
  conversationContext.history.push({
    sender: sender,
    text: text,
    timestamp: new Date().toISOString()
  });
  
  // Save the updated history
  saveChatHistory();
}

// Send a message to the chatbot and get a response
function sendMessage() {
  if (!chatInput || !chatInput.value.trim()) return;
  
  const userMessage = chatInput.value.trim();
  addMessage(userMessage, 'user');
  
  // Clear the input
  chatInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate a short delay for a more natural conversation feel
  setTimeout(() => {
    // Get an appropriate response
    const botResponse = getResponse(userMessage);
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Add bot response
    addMessage(botResponse, 'bot');
    
    // If we're using server-side API, we'd make a fetch call here instead
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: userMessage })
    // });
    // const data = await response.json();
    // addMessage(data.response, 'bot');
    
  }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Show the typing indicator
function showTypingIndicator() {
  if (!chatMessages) return;
  
  const typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.classList.add('chat-message', 'bot-message', 'typing-indicator');
  
  const indicatorContent = document.createElement('div');
  indicatorContent.classList.add('message-content');
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.classList.add('typing-dot');
    indicatorContent.appendChild(dot);
  }
  
  typingIndicator.appendChild(indicatorContent);
  chatMessages.appendChild(typingIndicator);
  
  // Auto-scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide the typing indicator
function hideTypingIndicator() {
  if (!chatMessages) return;
  
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Toggle the chat window open/closed
function toggleChat() {
  if (!chatWindow) return;
  
  if (isChatOpen) {
    chatWindow.classList.remove('open');
  } else {
    chatWindow.classList.add('open');
    
    // If this is the first time opening, add the welcome message
    if (conversationContext.history.length === 0) {
      addMessage(CHATBOT_CONFIG.uiConfig.welcomeMessage, 'bot');
    }
    
    // Focus the input
    if (chatInput) {
      chatInput.focus();
    }
  }
  
  isChatOpen = !isChatOpen;
}

// Get a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Initialize the chatbot
function initializeChatbot() {
  // Create the chatbot UI
  createChatbotUI();
  
  // Load any existing chat history
  loadChatHistory();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('Khoisan Voice chatbot initialized');
}

// Create the chatbot UI
function createChatbotUI() {
  // Add the chatbot styles
  const style = document.createElement('style');
  style.textContent = `
    #chatbot-container {
      position: fixed;
      ${CHATBOT_CONFIG.uiConfig.position === 'bottom-right' ? 'bottom: 20px; right: 20px;' : 'bottom: 20px; left: 20px;'}
      z-index: 1000;
      font-family: ${CHATBOT_CONFIG.uiConfig.fontFamily};
    }
    
    #chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${CHATBOT_CONFIG.uiConfig.primaryColor};
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    
    #chat-toggle:hover {
      background-color: ${CHATBOT_CONFIG.uiConfig.secondaryColor};
      transform: scale(1.05);
    }
    
    #chat-icon {
      width: 30px;
      height: 30px;
    }
    
    #chat-window {
      position: absolute;
      bottom: 70px;
      ${CHATBOT_CONFIG.uiConfig.position === 'bottom-right' ? 'right: 0;' : 'left: 0;'}
      width: 320px;
      height: 400px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
    }
    
    #chat-window.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    
    #chat-header {
      background-color: ${CHATBOT_CONFIG.uiConfig.primaryColor};
      color: white;
      padding: 15px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #chat-close {
      cursor: pointer;
      font-size: 20px;
    }
    
    #chat-messages {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
    }
    
    .chat-message {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      max-width: 80%;
    }
    
    .user-message {
      align-self: flex-end;
      align-items: flex-end;
    }
    
    .bot-message {
      align-self: flex-start;
      align-items: flex-start;
    }
    
    .message-content {
      padding: 10px 15px;
      border-radius: 18px;
      background-color: #f1f1f1;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .user-message .message-content {
      background-color: ${CHATBOT_CONFIG.uiConfig.primaryColor};
      color: white;
    }
    
    #chat-input-container {
      display: flex;
      padding: 10px;
      border-top: 1px solid #e6e6e6;
    }
    
    #chat-input {
      flex-grow: 1;
      border: 1px solid #e6e6e6;
      border-radius: 20px;
      padding: 8px 15px;
      outline: none;
      font-family: inherit;
    }
    
    #chat-send {
      background-color: ${CHATBOT_CONFIG.uiConfig.primaryColor};
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 0.3s ease;
    }
    
    #chat-send:hover {
      background-color: ${CHATBOT_CONFIG.uiConfig.secondaryColor};
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
    }
    
    .typing-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 4px;
      background-color: #808080;
      border-radius: 50%;
      animation: typing-dot 1.4s infinite ease-in-out both;
    }
    
    .typing-dot:nth-child(1) {
      animation-delay: 0s;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
    
    @keyframes typing-dot {
      0%, 80%, 100% { transform: scale(0.7); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  // Create the chat toggle button and window
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'chatbot-container';
  
  // Chat toggle button with SVG icon
  const chatToggle = document.createElement('div');
  chatToggle.id = 'chat-toggle';
  chatToggle.innerHTML = `
    <svg id="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  
  // Chat window
  const chatWindowElement = document.createElement('div');
  chatWindowElement.id = 'chat-window';
  
  // Chat header
  const chatHeader = document.createElement('div');
  chatHeader.id = 'chat-header';
  chatHeader.innerHTML = `
    <div>${CHATBOT_CONFIG.uiConfig.botName}</div>
    <div id="chat-close">×</div>
  `;
  
  // Chat messages container
  const chatMessagesElement = document.createElement('div');
  chatMessagesElement.id = 'chat-messages';
  
  // Chat input container
  const chatInputContainer = document.createElement('div');
  chatInputContainer.id = 'chat-input-container';
  
  // Chat input field
  const chatInputElement = document.createElement('input');
  chatInputElement.id = 'chat-input';
  chatInputElement.type = 'text';
  chatInputElement.placeholder = 'Type your message...';
  
  // Chat send button
  const chatSendButton = document.createElement('button');
  chatSendButton.id = 'chat-send';
  chatSendButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  `;
  
  // Assemble the chat input container
  chatInputContainer.appendChild(chatInputElement);
  chatInputContainer.appendChild(chatSendButton);
  
  // Assemble the chat window
  chatWindowElement.appendChild(chatHeader);
  chatWindowElement.appendChild(chatMessagesElement);
  chatWindowElement.appendChild(chatInputContainer);
  
  // Assemble the chatbot container
  chatbotContainer.appendChild(chatToggle);
  chatbotContainer.appendChild(chatWindowElement);
  
  // Add the chatbot to the page
  document.body.appendChild(chatbotContainer);
  
  // Store references to the elements
  chatWindow = chatWindowElement;
  chatInput = chatInputElement;
  chatMessages = chatMessagesElement;
}

// Setup event listeners for the chatbot
function setupEventListeners() {
  // Chat toggle button
  const chatToggle = document.getElementById('chat-toggle');
  if (chatToggle) {
    chatToggle.addEventListener('click', toggleChat);
  }
  
  // Chat close button
  const chatClose = document.getElementById('chat-close');
  if (chatClose) {
    chatClose.addEventListener('click', toggleChat);
  }
  
  // Chat send button
  const chatSend = document.getElementById('chat-send');
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }
  
  // Chat input field (send on Enter)
  if (chatInput) {
    chatInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });
  }
}

// Initialize the chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeChatbot);

// Export functions for potential external use
window.KhoisanChatbot = {
  toggleChat,
  sendMessage
};
