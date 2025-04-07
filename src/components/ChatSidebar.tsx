
import React from 'react';
import { PlusCircle, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryItem {
  id: string;
  title: string;
  isActive?: boolean;
}

const ChatSidebar = () => {
  // Mock chat history data
  const recentChats: ChatHistoryItem[] = [
    { id: '1', title: 'Project planning assistance', isActive: true },
    { id: '2', title: 'Website content review' },
    { id: '3', title: 'Marketing strategy ideas' },
    { id: '4', title: 'Code explanation for React hooks' },
    { id: '5', title: 'Product description writing' },
    { id: '6', title: 'Email template drafting' },
  ];

  return (
    <div className="w-64 bg-claude-sidebar h-screen flex flex-col">
      {/* Sidebar header */}
      <div className="p-4 flex items-center">
        <div className="text-white font-medium flex items-center">
          <span className="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L1 12L12 22L23 12L12 2Z" fill="white" />
            </svg>
          </span>
          Claude
        </div>
      </div>

      {/* New chat button */}
      <div className="p-2">
        <button className="flex items-center justify-center w-full rounded-md bg-white/10 text-white py-2 px-3 text-sm hover:bg-white/20 transition-colors">
          <PlusCircle className="h-4 w-4 mr-2" /> New chat
        </button>
      </div>

      {/* Chats section */}
      <div className="mt-4 px-2">
        <div className="flex items-center px-2 mb-2">
          <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-400 text-sm">Chats</span>
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto chat-history">
        {recentChats.map((chat) => (
          <div 
            key={chat.id}
            className={cn(
              "px-2 py-2 mx-2 rounded-md text-sm mb-1 cursor-pointer",
              chat.isActive 
                ? "bg-white/10 text-white" 
                : "text-gray-400 hover:bg-white/5"
            )}
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center text-gray-300 text-sm">
          <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mr-2">
            <User className="h-4 w-4" />
          </div>
          <span>Free plan</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
