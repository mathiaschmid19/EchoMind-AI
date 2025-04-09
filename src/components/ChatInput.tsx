import React, { useState, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  modelName?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isDisabled = false,
  modelName = "AI",
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Check if the chat is empty by looking for messages in localStorage
  useEffect(() => {
    const checkIfEmpty = () => {
      if (typeof window !== "undefined") {
        try {
          const chatHistory = localStorage.getItem("chatty-mimic-history");
          const currentId = localStorage.getItem("chatty-mimic-current-chat");

          if (chatHistory && currentId) {
            const parsed = JSON.parse(chatHistory);
            const currentChat = parsed[currentId];

            // If there's more than one message (not just the welcome message)
            if (Array.isArray(currentChat) && currentChat.length > 1) {
              setIsEmpty(false);
              return;
            }
          }

          setIsEmpty(true);
        } catch (e) {
          setIsEmpty(true);
        }
      }
    };

    checkIfEmpty();
    window.addEventListener("storage", checkIfEmpty);
    return () => window.removeEventListener("storage", checkIfEmpty);
  }, []);

  // Also check when user types a message
  useEffect(() => {
    if (message.trim() !== "") {
      setIsEmpty(false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        // Insert new line at cursor position
        const cursorPosition = e.currentTarget.selectionStart;
        const textBeforeCursor = message.substring(0, cursorPosition);
        const textAfterCursor = message.substring(cursorPosition);
        setMessage(textBeforeCursor + "\n" + textAfterCursor);
        // Move cursor after the new line
        setTimeout(() => {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
            cursorPosition + 1;
        }, 0);
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <div className={`relative w-full px-4 z-40 ${isEmpty ? "-mt-36" : "mt-2"}`}>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Press Enter to send, Ctrl+Enter for new line)"
            className={`w-full px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[44px] max-h-[200px] py-3 ${
              isFocused ? "py-4" : "py-3"
            }`}
            disabled={isDisabled}
            autoFocus
            rows={1}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-lg p-1 ${
              message.trim() && !isDisabled
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!message.trim() || isDisabled}
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>
      </div>
      <div className="text-xs text-center mt-2 text-gray-500 pb-4">
        Using {modelName}
      </div>
    </div>
  );
};

export default ChatInput;
