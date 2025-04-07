
import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  modelName?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isDisabled = false,
  modelName = 'AI'
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent"
            disabled={isDisabled}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-lg p-1 ${
              message.trim() && !isDisabled
                ? 'bg-claude-accent text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim() || isDisabled}
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>
        <div className="text-xs text-center mt-2 text-claude-textSecondary">
          {modelName}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
