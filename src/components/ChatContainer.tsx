
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage, { MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import ApiKeyInput from './ApiKeyInput';
import { sendMessageToOpenRouter, availableModels } from '@/lib/openRouter';
import { toast } from 'sonner';
import ModelSelector from './ModelSelector';

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
}

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! Welcome back. How can I help you today?',
      role: 'assistant',
      timestamp: '2:34 PM',
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0].id);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: getFormattedTime(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Prepare messages for OpenRouter API (only include content and role)
      const apiMessages = messages.concat(newUserMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send request to OpenRouter with selected model
      const response = await sendMessageToOpenRouter(apiMessages, selectedModel);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: response.id || (Date.now() + 1).toString(),
        content: response.choices[0].message.content,
        role: 'assistant',
        timestamp: getFormattedTime(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get a response. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find the currently selected model name for the UI
  const selectedModelName = availableModels.find(m => m.id === selectedModel)?.name || 'AI';

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      <ApiKeyInput />
      <div className="flex-1 overflow-y-auto pb-24">
        <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
        
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            content={message.content} 
            role={message.role} 
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="py-6 bg-white animate-pulse">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="h-8 w-8 rounded-full bg-claude-accent flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">Q</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} modelName={selectedModelName} />
    </div>
  );
};

export default ChatContainer;
