
import React, { useState } from 'react';
import { PaperclipIcon, SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white py-4 sticky bottom-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-claude-inputBg rounded-lg flex items-start">
          <button 
            className="p-3 text-gray-500 hover:text-gray-700" 
            aria-label="Attach file"
            disabled={isDisabled}
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>
          <textarea
            className="flex-grow bg-transparent py-3 px-1 focus:outline-none resize-none h-12 max-h-60 text-sm"
            placeholder={isDisabled ? "Waiting for response..." : "How can I help you today?"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ minHeight: '24px', height: 'auto' }}
            disabled={isDisabled}
          />
          <button 
            className={`p-3 ${message.trim() && !isDisabled ? 'text-claude-accent' : 'text-gray-400'}`}
            onClick={handleSend}
            disabled={!message.trim() || isDisabled}
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="text-xs text-center mt-2 text-claude-textSecondary">
          Qwen 2.5 VL 72B
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
