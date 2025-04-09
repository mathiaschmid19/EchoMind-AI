import React, { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatContainer from "@/components/ChatContainer";

const CURRENT_CHAT_ID_KEY = "chatty-mimic-current-chat";

const Index: React.FC = () => {
  const [chatId, setChatId] = useState<string>("default");
  const [forceRerender, setForceRerender] = useState<number>(0);

  // Listen for chat ID changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const currentChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);
      if (currentChatId && currentChatId !== chatId) {
        setChatId(currentChatId);
        // Force a rerender of the ChatContainer
        setForceRerender((prev) => prev + 1);
      }
    };

    // Set initial chatId from localStorage if it exists
    const storedChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);
    if (storedChatId) {
      setChatId(storedChatId);
    }

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom storage events
    const handleCustomStorageEvent = () => {
      handleStorageChange();
    };
    window.addEventListener("storage", handleCustomStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorageEvent);
    };
  }, [chatId]);

  const handleNewChat = () => {
    // Generate a new unique chat ID when starting a new chat
    const newChatId = `chat-${Date.now()}`;
    localStorage.setItem(CURRENT_CHAT_ID_KEY, newChatId);
    setChatId(newChatId);
    // Force a rerender of the ChatContainer
    setForceRerender((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar onNewChat={handleNewChat} />
      <ChatContainer key={`${chatId}-${forceRerender}`} />
    </div>
  );
};

export default Index;
