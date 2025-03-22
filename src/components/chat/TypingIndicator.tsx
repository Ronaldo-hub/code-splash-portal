
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg p-4 bg-secondary text-secondary-foreground flex items-center">
        <div className="flex space-x-3">
          <div className="h-3 w-3 rounded-full bg-current animate-bounce"></div>
          <div className="h-3 w-3 rounded-full bg-current animate-bounce delay-75"></div>
          <div className="h-3 w-3 rounded-full bg-current animate-bounce delay-150"></div>
        </div>
        <span className="ml-2 text-sm">AI assistant is typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
