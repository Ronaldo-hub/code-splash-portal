/**
 * Khoisan Voice Chatbot for Cisco Meraki External Captive Portal
 * A conversational assistant that provides information about the Khoisan mandate
 * while also helping users with portal authentication.
 */

(function() {
    // Configuration
    const CHATBOT_NAME = "Khoisan Voice";
    const CHAT_STORAGE_KEY = "khoisanChatHistory";
    const MAX_HISTORY = 10;
    
    // Predefined responses for common queries
    const knowledgeBase = {
        // Land sovereignty responses
        land: [
            "The Khoisan mandate calls for full recognition as the original First Nations of Southern Africa and unconditional return of ancestral territories. This includes complete land ownership, mineral rights, and access to maritime resources. Archaeological evidence suggests the Khoisan have lived in Southern Africa for up to 140,000 years. Would you like to know more about the historical context?",
            "Land sovereignty is central to the Khoisan identity. The mandate emphasizes returning ancestral territories that were taken during colonization, along with all associated rights to resources. This seeks to restore indigenous stewardship over lands that sustained Khoisan communities for thousands of generations. Does that address your question?",
            "For the Khoisan people, land sovereignty isn't just about ownership—it's about reconnecting with ancestral territories that hold deep cultural and spiritual significance. The mandate seeks to restore these connections that were severed through colonization and displacement. Is there a specific aspect of land rights you're curious about?"
        ],
        
        // Cultural recognition responses
        culture: [
            "Cultural recognition in the Khoisan mandate includes stopping the use of colonial terms like 'coloured,' officially recognizing Khoisan languages as national languages, and funding language preservation programs. Some Khoisan languages have fewer than 100 fluent speakers left, making preservation urgent. What aspects of cultural identity interest you most?",
            "The Khoisan languages are among the oldest in the world, featuring unique click consonants found in few other languages. The mandate seeks to preserve this linguistic heritage through official recognition and comprehensive language revitalization programs. Would you like to learn about other cultural preservation efforts?",
            "Khoisan cultural recognition extends beyond language to include traditional knowledge systems, spiritual practices, and community governance structures that have been marginalized by colonial systems. The mandate seeks to restore dignity and respect to these cultural elements. Is there a particular aspect of Khoisan culture you'd like to explore?"
        ],
        
        // Political representation responses
        representation: [
            "Political representation for the Khoisan involves direct parliamentary representation and veto power on legislation affecting their territories and rights. The mandate emphasizes that no agreements or laws should be enacted without explicit Khoisan community consent, following the principle of Free, Prior and Informed Consent. How do you feel this would change current governance?",
            "Despite constitutional recognition in some countries, practical implementation of Khoisan rights remains severely limited. The mandate seeks to address this by ensuring Khoisan communities have meaningful participation in decision-making processes that affect their lands, resources, and way of life. Would you like to know more about how this would work?",
            "Traditional Khoisan leadership structures must be officially recognized and incorporated into governance frameworks. This would restore indigenous decision-making processes that were disrupted by colonial systems. Does this help clarify the political representation aspects of the mandate?"
        ],
        
        // Financial reparation responses
        reparation: [
            "Financial reparations in the Khoisan mandate focus on establishing a dedicated national fund for community development and creating transparent mechanisms to compensate for centuries of economic marginalization. These reparations aim to provide resources for education, healthcare, and cultural preservation. Would you like to know more about how these funds would be allocated?",
            "The reparations sought aren't just about money—they're about addressing historical injustices that have created ongoing economic disadvantages. This includes compensating for land loss, resource extraction, and systematic exclusion from economic opportunities. Does this help explain the reparation component?",
            "Financial reparation is viewed as a crucial step toward healing historical wounds and creating economic justice. The mandate calls for both immediate community development funds and long-term mechanisms to address the intergenerational impacts of colonization and apartheid. Is there a specific aspect of the reparations you're interested in?"
        ],
        
        // Portal assistance responses
        portal: [
            "Welcome to the Khoisan Voice Wi-Fi portal! To connect, simply enter your email address in the form above, and click the 'Connect' button. While you're here, feel free to ask me about the Khoisan mandate and indigenous rights.",
            "To get online, just fill out the quick form with your email address. Once you're connected, you'll have access to information about the Khoisan First Nations mandate and other resources. Need help with anything else?",
            "You can connect to our Wi-Fi by entering your email in the form. While you're connecting, would you like to learn about the Khoisan mandate's key positions on land sovereignty, cultural recognition, political representation, or financial reparation?"
        ],
        
        // Fallback responses
        fallback: [
            "That's an interesting question. The Khoisan mandate covers four key areas: land sovereignty, cultural recognition, political representation, and financial reparation. Which of these would you like to learn more about?",
            "I'm not sure I fully understand your question. Could you tell me more about what you'd like to know? I can share information about the Khoisan mandate on land rights, cultural recognition, political voice, or economic justice.",
            "I'd like to help with that. To give you the best information, could you clarify if you're asking about land sovereignty, cultural recognition, political representation, or financial reparations? These are the four pillars of the Khoisan mandate."
        ]
    };
    
    // Chat history management
    let chatHistory = [];
    
    function loadChatHistory() {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
            try {
                chatHistory = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load chat history:", e);
                chatHistory = [];
            }
        }
    }
    
    function saveChatHistory() {
        // Keep only the most recent messages
        if (chatHistory.length > MAX_HISTORY) {
            chatHistory = chatHistory.slice(chatHistory.length - MAX_HISTORY);
        }
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    }
    
    function addMessageToHistory(message, isUser) {
        chatHistory.push({
            content: message,
            isUser: isUser,
            timestamp: new Date().toISOString()
        });
        saveChatHistory();
    }
    
    // Topic detection
    function detectTopic(message) {
        const messageLower = message.toLowerCase();
        
        // Check for portal/connection related queries
        if (messageLower.includes("connect") || messageLower.includes("wifi") || 
            messageLower.includes("login") || messageLower.includes("sign in") ||
            messageLower.includes("internet") || messageLower.includes("network")) {
            return "portal";
        }
        
        // Check for land sovereignty queries
        if (messageLower.includes("land") || messageLower.includes("territory") || 
            messageLower.includes("ancestral") || messageLower.includes("sovereign")) {
            return "land";
        }
        
        // Check for cultural recognition queries
        if (messageLower.includes("culture") || messageLower.includes("language") || 
            messageLower.includes("identity") || messageLower.includes("coloured") ||
            messageLower.includes("heritage") || messageLower.includes("tradition")) {
            return "culture";
        }
        
        // Check for political representation queries
        if (messageLower.includes("representation") || messageLower.includes("political") || 
            messageLower.includes("parliament") || messageLower.includes("governance") ||
            messageLower.includes("voting") || messageLower.includes("rights")) {
            return "representation";
        }
        
        // Check for financial reparation queries
        if (messageLower.includes("financial") || messageLower.includes("reparation") || 
            messageLower.includes("compensation") || messageLower.includes("fund") ||
            messageLower.includes("economic") || messageLower.includes("money")) {
            return "reparation";
        }
        
        // If no specific topic is detected
        return "fallback";
    }
    
    // Generate natural-sounding responses
    function generateResponse(message) {
        // First detect the topic of the message
        const topic = detectTopic(message);
        
        // Get relevant responses for the topic
        const responses = knowledgeBase[topic] || knowledgeBase.fallback;
        
        // Choose a response, preferably not the last one used for this topic
        let lastIndex = -1;
        if (chatHistory.length > 0) {
            const lastBotMessage = chatHistory.filter(msg => !msg.isUser).pop();
            if (lastBotMessage) {
                for (let i = 0; i < responses.length; i++) {
                    if (lastBotMessage.content === responses[i]) {
                        lastIndex = i;
                        break;
                    }
                }
            }
        }
        
        // Pick a different response if possible
        let responseIndex;
        if (responses.length > 1 && lastIndex !== -1) {
            do {
                responseIndex = Math.floor(Math.random() * responses.length);
            } while (responseIndex === lastIndex && responses.length > 1);
        } else {
            responseIndex = Math.floor(Math.random() * responses.length);
        }
        
        return responses[responseIndex];
    }
    
    // Handle specific queries
    function handleSpecificQuery(message) {
        const messageLower = message.toLowerCase();
        
        // Handle "What forms of financial reparation are being sought?"
        if (messageLower.includes("what forms of financial reparation") || 
            (messageLower.includes("financial") && messageLower.includes("reparation") && 
             (messageLower.includes("what") || messageLower.includes("how")))) {
            return "Financial reparations for the Khoisan mandate focus on compensating for historical land loss and economic marginalization, potentially through community funds or resource rights. The mandate specifically calls for a dedicated national fund for Khoisan community development and transparent mechanisms to address historical economic damage. These funds would support education, healthcare, and cultural preservation programs. Want to know more about how this is being proposed?";
        }
        
        return null;
    }
    
    // Create and inject chatbot UI
    function createChatbotUI() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'khoisan-chatbot';
        chatContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-width: 90vw;
            height: 450px;
            max-height: 70vh;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            transform: translateY(380px);
        `;
        
        // Create chat header
        const chatHeader = document.createElement('div');
        chatHeader.style.cssText = `
            background: #60270E;
            color: white;
            padding: 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        `;
        chatHeader.innerHTML = `
            <span>${CHATBOT_NAME} Assistant</span>
            <span id="chat-toggle">▲</span>
        `;
        
        // Create chat messages area
        const chatMessages = document.createElement('div');
        chatMessages.id = 'chat-messages';
        chatMessages.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        // Create chat input area
        const chatInputArea = document.createElement('div');
        chatInputArea.style.cssText = `
            padding: 10px;
            border-top: 1px solid #eee;
            display: flex;
        `;
        
        // Create chat input
        const chatInput = document.createElement('input');
        chatInput.type = 'text';
        chatInput.id = 'chat-input';
        chatInput.placeholder = 'Ask about the Khoisan mandate...';
        chatInput.style.cssText = `
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        `;
        
        // Create send button
        const sendButton = document.createElement('button');
        sendButton.id = 'chat-send';
        sendButton.innerHTML = '→';
        sendButton.style.cssText = `
            background: #60270E;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
            font-size: 18px;
        `;
        
        // Assemble the chat UI
        chatInputArea.appendChild(chatInput);
        chatInputArea.appendChild(sendButton);
        
        chatContainer.appendChild(chatHeader);
        chatContainer.appendChild(chatMessages);
        chatContainer.appendChild(chatInputArea);
        
        // Add to page
        document.body.appendChild(chatContainer);
        
        // Add welcome message
        addBotMessage("Hello! I'm here to help with both Wi-Fi connection and information about the Khoisan mandate. What would you like to know?");
        
        // Toggle chat open/closed
        let isChatOpen = false;
        chatHeader.addEventListener('click', function() {
            isChatOpen = !isChatOpen;
            chatContainer.style.transform = isChatOpen ? 'translateY(0)' : 'translateY(380px)';
            document.getElementById('chat-toggle').textContent = isChatOpen ? '▼' : '▲';
        });
        
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Load previous chat history
        loadChatHistory();
        displayChatHistory();
    }
    
    // Display chat history
    function displayChatHistory() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        chatHistory.forEach(message => {
            if (message.isUser) {
                addUserMessageToUI(message.content);
            } else {
                addBotMessageToUI(message.content);
            }
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add user message to UI
    function addUserMessageToUI(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.style.cssText = `
            align-self: flex-end;
            background: #E6F2FF;
            padding: 10px 15px;
            border-radius: 20px 20px 0 20px;
            max-width: 80%;
            word-wrap: break-word;
        `;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add bot message to UI
    function addBotMessageToUI(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'bot-message';
        messageElement.style.cssText = `
            align-self: flex-start;
            background: #F0F0F0;
            padding: 10px 15px;
            border-radius: 20px 20px 20px 0;
            max-width: 80%;
            word-wrap: break-word;
        `;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add user message
    function addUserMessage(message) {
        addUserMessageToUI(message);
        addMessageToHistory(message, true);
    }
    
    // Add bot message
    function addBotMessage(message) {
        addBotMessageToUI(message);
        addMessageToHistory(message, false);
    }
    
    // Send message function
    function sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            chatInput.value = '';
            
            // Add typing indicator
            showTypingIndicator();
            
            // Process message and respond with slight delay for natural feel
            setTimeout(() => {
                // Hide typing indicator
                hideTypingIndicator();
                
                // Check for specific queries first
                const specificResponse = handleSpecificQuery(message);
                if (specificResponse) {
                    addBotMessage(specificResponse);
                } else {
                    // Generate general response
                    const response = generateResponse(message);
                    addBotMessage(response);
                }
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.style.cssText = `
            align-self: flex-start;
            background: #F0F0F0;
            padding: 10px 15px;
            border-radius: 20px 20px 20px 0;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        `;
        typingIndicator.innerHTML = `
            <span style="width: 8px; height: 8px; background: #777; border-radius: 50%; margin-right: 4px; animation: pulse 1s infinite"></span>
            <span style="width: 8px; height: 8px; background: #777; border-radius: 50%; margin-right: 4px; animation: pulse 1s infinite .2s"></span>
            <span style="width: 8px; height: 8px; background: #777; border-radius: 50%; animation: pulse 1s infinite .4s"></span>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: .4; }
                50% { opacity: 1; }
                100% { opacity: .4; }
            }
        `;
        document.head.appendChild(style);
        
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Initialize the chatbot when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Create and inject the chatbot UI
        createChatbotUI();
        
        console.log("Khoisan Voice Chatbot initialized");
    });
    
    // If the DOM is already loaded, initialize immediately
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        createChatbotUI();
        console.log("Khoisan Voice Chatbot initialized (DOM already loaded)");
    }
})();
