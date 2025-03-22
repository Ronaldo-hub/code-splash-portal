
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
        <div className="flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75"></div>
          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
