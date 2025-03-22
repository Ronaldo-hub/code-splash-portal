
import React, { useEffect, useRef } from "react";
import { Message } from "@/utils/aiUtils";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col space-y-2 h-[50vh] overflow-y-auto p-4 bg-muted/50 rounded-lg">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No messages yet. Start typing to chat with the AI assistant.
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
