import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  MessageSquare,
  User,
  Trash2,
  Settings,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SettingsPopup from "./SettingsPopup";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [initialActiveTab, setInitialActiveTab] = useState("api");
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top section with header and new chat */}
      <div className="flex-none">
        {/* Sidebar header with collapse button */}
        <div
          className={cn(
            "p-4 flex items-center",
            isCollapsed && !isMobile ? "justify-center" : "justify-between"
          )}
        >
          {(!isCollapsed || isMobile) && !isMobile && (
            <div className="text-white dark:text-gray-100 font-medium flex items-center">
              <img
                src="/logo.svg"
                alt="EchoMind Logo"
                className="h-6 w-6 mr-2"
              />
              EchoMind
            </div>
          )}
          {!isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-full hover:bg-blue-800/50 text-white transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isCollapsed ? (
                      <ChevronRight size={18} />
                    ) : (
                      <ChevronLeft size={18} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* New chat button */}
        <div className="p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNewChat}
                  className={cn(
                    "flex items-center justify-center w-full rounded-md bg-blue-700 dark:bg-blue-600 text-white py-2 transition-colors",
                    isCollapsed && !isMobile
                      ? "px-2 hover:bg-blue-600"
                      : "px-3 hover:bg-blue-600 dark:hover:bg-blue-500"
                  )}
                >
                  <PlusCircle
                    className={cn(
                      "h-4 w-4",
                      (!isCollapsed || isMobile) && "mr-2"
                    )}
                  />
                  {(!isCollapsed || isMobile) && "New chat"}
                </button>
              </TooltipTrigger>
              {isCollapsed && !isMobile && (
                <TooltipContent side="right">New chat</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Chats section header */}
        <div className={cn("mt-4", isCollapsed && !isMobile ? "px-2" : "px-2")}>
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center px-2 mb-2">
              <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                Chats
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chat history - takes remaining space */}
      <div
        className={cn(
          "flex-1 overflow-y-auto chat-history min-h-0",
          isCollapsed && !isMobile ? "px-2" : ""
        )}
      >
        {recentChats.length > 0 ? (
          recentChats.map((chat) => (
            <TooltipProvider key={chat.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => switchToChat(chat.id)}
                    className={cn(
                      "rounded-md text-sm mb-1 cursor-pointer flex items-center group",
                      isCollapsed && !isMobile
                        ? "justify-center p-2"
                        : "justify-between px-2 py-2 mx-2",
                      chat.isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:bg-white/5"
                    )}
                  >
                    {isCollapsed && !isMobile ? (
                      <MessageSquare className="h-4 w-4" />
                    ) : (
                      <>
                        <span className="truncate flex-1">{chat.title}</span>
                        <button
                          onClick={(e) => deleteChat(e, chat.id)}
                          className={cn(
                            "text-gray-400 hover:text-red-400 transition-colors p-1 rounded focus:outline-none",
                            !chat.isActive &&
                              "opacity-0 group-hover:opacity-100"
                          )}
                          aria-label="Delete chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
                  <TooltipContent side="right">{chat.title}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <div
            className={cn(
              "text-gray-400 text-sm italic",
              isCollapsed && !isMobile ? "text-center" : "px-4 py-2"
            )}
          >
            {isCollapsed && !isMobile ? "•" : "No chat history yet"}
          </div>
        )}
      </div>

      {/* User section - fixed at bottom */}
      <div
        className={cn(
          "flex-none p-4 border-t border-blue-800 mt-auto",
          isCollapsed && !isMobile && "px-2"
        )}
      >
        {isSignedIn ? (
          <div className="flex items-center justify-start">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setInitialActiveTab("account");
                      setIsSettingsOpen(true);
                    }}
                    className={cn(
                      "flex items-center group hover:bg-blue-800/30 rounded-lg transition-colors w-full",
                      isCollapsed && !isMobile
                        ? "justify-center p-2"
                        : "p-2 -ml-2"
                    )}
                  >
                    <div className="flex items-center">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className={cn(
                            "rounded-full object-cover",
                            isCollapsed && !isMobile
                              ? "h-8 w-8"
                              : "h-8 w-8 mr-2"
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            "rounded-full bg-blue-700 flex items-center justify-center",
                            isCollapsed && !isMobile
                              ? "h-8 w-8"
                              : "h-8 w-8 mr-2"
                          )}
                        >
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {(!isCollapsed || isMobile) && (
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-white group-hover:text-blue-200">
                            {user?.firstName || user?.username || "User"}
                          </span>
                          <span className="text-[10px] text-gray-400/80">
                            {user?.primaryEmailAddress?.emailAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
                  <TooltipContent side="right">
                    {user?.firstName || user?.username || "User"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            {(!isCollapsed || isMobile) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setInitialActiveTab("appearance");
                        setIsSettingsOpen(true);
                      }}
                      className="p-1.5 rounded-full hover:bg-blue-800 text-white transition-colors ml-2"
                      title="Settings"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          <div
            className={cn("space-y-3", isCollapsed && !isMobile && "hidden")}
          >
            <div className="text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-blue-700 flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-sm font-medium text-white">
                Welcome to EchoMind
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Sign in to access all features
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => openSignIn()}
                className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={() => openSignUp()}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Popup */}
      <SettingsPopup
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialActiveTab={initialActiveTab}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-blue-900/80 dark:bg-gray-800/80 text-white hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-blue-900 dark:bg-gray-800 border-r border-blue-800 transition-transform duration-500 ease-in-out flex flex-col h-full"
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="text-white dark:text-gray-100 font-medium flex items-center">
              <img
                src="/logo.svg"
                alt="EchoMind Logo"
                className="h-6 w-6 mr-2"
              />
              EchoMind
            </div>
            <SheetTrigger asChild>
              <button className="p-2.5 rounded-full hover:bg-blue-800/50 dark:hover:bg-gray-700/50 text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </SheetTrigger>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "bg-blue-900 dark:bg-gray-800 h-screen flex flex-col transition-all duration-500 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent />
    </div>
  );
};

export default ChatSidebar;
