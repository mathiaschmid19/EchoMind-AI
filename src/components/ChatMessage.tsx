
import React from 'react';
import { User } from 'lucide-react';

export type MessageRole = 'user' | 'assistant';

interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp }) => {
  return (
    <div className={`py-6 ${role === 'assistant' ? 'bg-white' : 'bg-[#F7F7F8]'} animate-fade-in`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-start">
          {/* Avatar */}
          <div className="mr-4 mt-1">
            {role === 'assistant' ? (
              <div className="h-8 w-8 rounded-full bg-claude-accent flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Q</span>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
          
          {/* Message content */}
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <div className="font-medium text-sm text-claude-textPrimary">
                {role === 'assistant' ? 'Qwen' : 'You'}
              </div>
              {timestamp && (
                <div className="text-xs text-claude-textSecondary ml-2">
                  {timestamp}
                </div>
              )}
            </div>
            <div className="text-claude-textPrimary text-sm">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
