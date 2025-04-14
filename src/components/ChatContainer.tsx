import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { MessageRole } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendMessageToOpenRouter, availableModels } from "@/lib/openRouter";
import { toast } from "sonner";
import ModelSelector from "./ModelSelector";
import { Share2, Download } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
}

const CHAT_HISTORY_KEY = "chatty-mimic-history";
const CURRENT_CHAT_ID_KEY = "chatty-mimic-current-chat";

const ChatContainer: React.FC = () => {
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const initialMessage = {
    id: "welcome-1",
    content:
      "Hello! I'm EchoMind, powered by OpenRouter AI models. How can I assist you today?",
    role: "assistant" as MessageRole,
    timestamp: getFormattedTime(),
  };

  // Generate a unique chat ID for this session if one doesn't exist
  const [chatId, setChatId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const currentChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);
      if (currentChatId) return currentChatId;

      const newChatId = `chat-${Date.now()}`;
      localStorage.setItem(CURRENT_CHAT_ID_KEY, newChatId);
      return newChatId;
    }
    return `chat-${Date.now()}`;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage for this particular chat
    if (typeof window !== "undefined") {
      try {
        const allChats = localStorage.getItem(CHAT_HISTORY_KEY);
        if (allChats && allChats !== "undefined" && allChats !== "null") {
          const parsedChats = JSON.parse(allChats);
          if (parsedChats && typeof parsedChats === "object") {
            // Look for this chat's messages
            const chatMessages = parsedChats[chatId];
            if (Array.isArray(chatMessages) && chatMessages.length > 0) {
              return chatMessages;
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    // Default to initial welcome message if no saved history
    return [initialMessage];
  });

  // Reset messages to initial state when component is remounted with a new key
  useEffect(() => {
    // Only create a new chat ID if we don't already have one from localStorage
    if (typeof window !== "undefined") {
      const existingChatId = localStorage.getItem(CURRENT_CHAT_ID_KEY);
      if (!existingChatId) {
        const newChatId = `chat-${Date.now()}`;
        localStorage.setItem(CURRENT_CHAT_ID_KEY, newChatId);
        setChatId(newChatId);
      }
    }
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(
    availableModels[0].id
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        // Only save chats that have at least one user message
        const hasUserMessage = messages.some((msg) => msg.role === "user");
        if (!hasUserMessage) return;

        // Get all existing chats
        const allChats = localStorage.getItem(CHAT_HISTORY_KEY);
        let chatsObj = {};

        if (allChats && allChats !== "undefined" && allChats !== "null") {
          try {
            chatsObj = JSON.parse(allChats);
          } catch (e) {
            console.error("Failed to parse existing chats", e);
          }
        }

        // Update the current chat's messages
        chatsObj = {
          ...chatsObj,
          [chatId]: messages,
        };

        // Save all chats back to localStorage
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatsObj));

        // Make sure current chat ID is up to date
        localStorage.setItem(CURRENT_CHAT_ID_KEY, chatId);

        // Trigger a storage event for the sidebar to detect
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to save messages to localStorage", e);
      }
    }
  }, [messages, chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for OpenRouter API (only include content and role)
      const apiMessages = messages.concat(newUserMessage).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send request to OpenRouter with selected model
      const response = await sendMessageToOpenRouter(
        apiMessages,
        selectedModel
      );

      // Add assistant response
      const assistantMessage: Message = {
        id: response.id || (Date.now() + 1).toString(),
        content: response.choices[0].message.content,
        role: "assistant",
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get a response. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  // Find the currently selected model name for the UI
  const selectedModelName =
    availableModels.find((m) => m.id === selectedModel)?.name || "AI";

  const handleShareChat = async () => {
    try {
      // Create a shareable link with the chat ID
      const shareableLink = `${window.location.origin}?chat=${chatId}`;

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: "Chat with EchoMind",
          text: "Check out my conversation with EchoMind AI",
          url: shareableLink,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareableLink);
        toast.success("Chat link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing chat:", error);
      toast.error("Failed to share chat");
    }
  };

  const handleExportChat = () => {
    try {
      // Create a formatted export of the chat
      const chatExport = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      // Create and download the file
      const blob = new Blob([JSON.stringify(chatExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${chatId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Chat exported successfully!");
    } catch (error) {
      console.error("Error exporting chat:", error);
      toast.error("Failed to export chat");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between py-0 px-4">
        <div className="flex items-center">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareChat}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleExportChat}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="py-0 px-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isDisabled={isLoading}
            modelName={selectedModelName}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
