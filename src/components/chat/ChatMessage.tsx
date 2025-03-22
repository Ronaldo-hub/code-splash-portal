
import React from "react";
import { Message } from "@/utils/aiUtils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.role === "assistant" ? "justify-start" : "justify-end"
      } mb-2`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.role === "assistant"
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.role === "assistant" ? (
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-xs font-medium">AI Assistant</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-background"></div>
              <span className="text-xs font-medium">You</span>
            </div>
          )}
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
