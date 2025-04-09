import React, { useState, useEffect } from "react";
import { PlusCircle, MessageSquare, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
  id: string;
  title: string;
  isActive?: boolean;
}

interface Message {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}

interface ChatSidebarProps {
  onNewChat: () => void;
}

const CHAT_HISTORY_KEY = "chatty-mimic-history";
const CURRENT_CHAT_ID_KEY = "chatty-mimic-current-chat";

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onNewChat }) => {
  const [recentChats, setRecentChats] = useState<ChatHistoryItem[]>([]);

  // Load chat history from localStorage
  useEffect(() => {
    const loadChatHistory = () => {
      if (typeof window !== "undefined") {
        try {
          const allChats = localStorage.getItem(CHAT_HISTORY_KEY);
          const currentChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);

          if (allChats && allChats !== "undefined" && allChats !== "null") {
            const parsedChats = JSON.parse(allChats);

            if (parsedChats && typeof parsedChats === "object") {
              // Convert the chats object to array of ChatHistoryItems
              const chatItems: ChatHistoryItem[] = Object.entries(parsedChats)
                .map(([chatId, messages]) => {
                  const messagesArr = messages as Message[];

                  // Skip chats with no messages or no user messages
                  if (!Array.isArray(messagesArr) || messagesArr.length === 0)
                    return null;
                  const hasUserMessage = messagesArr.some(
                    (msg) => msg.role === "user"
                  );
                  if (!hasUserMessage) return null;

                  // Find first user message for title (not the default welcome message)
                  const firstUserMessage = messagesArr.find(
                    (msg) => msg.role === "user"
                  );

                  if (!firstUserMessage) return null;

                  // Create chat item with user message as title
                  return {
                    id: chatId,
                    title:
                      firstUserMessage.content.substring(0, 40) +
                      (firstUserMessage.content.length > 40 ? "..." : ""),
                    isActive: chatId === currentChatId,
                  };
                })
                .filter(Boolean) as ChatHistoryItem[];

              // Sort by ID (which has timestamp) to have newest first
              chatItems.sort((a, b) => {
                const idA = a.id.split("-")[1] || "0";
                const idB = b.id.split("-")[1] || "0";
                return Number(idB) - Number(idA);
              });

              setRecentChats(chatItems);
            }
          }
        } catch (e) {
          console.error("Failed to parse saved messages for sidebar", e);
          setRecentChats([]);
        }
      }
    };

    loadChatHistory();

    // Listen for storage events to update sidebar when chat history changes
    window.addEventListener("storage", loadChatHistory);
    return () => window.removeEventListener("storage", loadChatHistory);
  }, []);

  // Function to start a new chat
  const handleNewChat = () => {
    onNewChat();
  };

  // Function to delete a chat
  const deleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent triggering chat switch

    if (typeof window !== "undefined") {
      try {
        // Get current chats
        const allChats = localStorage.getItem(CHAT_HISTORY_KEY);
        if (allChats && allChats !== "undefined" && allChats !== "null") {
          const chatsObj = JSON.parse(allChats);

          // Remove the chat with this ID
          if (chatsObj && chatsObj[chatId]) {
            delete chatsObj[chatId];

            // Save back to localStorage
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatsObj));

            // Update UI
            setRecentChats((prev) => prev.filter((chat) => chat.id !== chatId));

            // If we deleted the active chat, start a new one
            const currentChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);
            if (currentChatId === chatId) {
              onNewChat();
            }

            // Trigger storage event for other components
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch (e) {
        console.error("Failed to delete chat", e);
      }
    }
  };

  // Function to switch to an existing chat
  const switchToChat = (chatId: string) => {
    if (typeof window !== "undefined") {
      // Set this as the current chat
      localStorage.setItem(CURRENT_CHAT_ID_KEY, chatId);

      // Update active states in the UI
      setRecentChats((chats) =>
        chats.map((chat) => ({
          ...chat,
          isActive: chat.id === chatId,
        }))
      );

      // Trigger storage event for parent to detect
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="w-64 bg-blue-900 h-screen flex flex-col">
      {/* Sidebar header */}
      <div className="p-4 flex items-center">
        <div className="text-white font-medium flex items-center">
          <span className="mr-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L1 12L12 22L23 12L12 2Z" fill="white" />
            </svg>
          </span>
          EchoMind
        </div>
      </div>

      {/* New chat button */}
      <div className="p-2">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center w-full rounded-md bg-blue-700 text-white py-2 px-3 text-sm hover:bg-blue-600 transition-colors"
        >
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
        {recentChats.length > 0 ? (
          recentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchToChat(chat.id)}
              className={cn(
                "px-2 py-2 mx-2 rounded-md text-sm mb-1 cursor-pointer flex justify-between items-center group",
                chat.isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5"
              )}
            >
              <span className="truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => deleteChat(e, chat.id)}
                className={cn(
                  "text-gray-400 hover:text-red-400 transition-colors p-1 rounded focus:outline-none",
                  !chat.isActive && "opacity-0 group-hover:opacity-100"
                )}
                aria-label="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-gray-400 text-sm italic">
            No chat history yet
          </div>
        )}
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
