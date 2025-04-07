
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage, { MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import ApiKeyInput from './ApiKeyInput';
import { sendMessageToOpenRouter } from '@/lib/openRouter';
import { toast } from 'sonner';

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
      
      // Send request to OpenRouter
      const response = await sendMessageToOpenRouter(apiMessages);
      
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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      <ApiKeyInput />
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="py-4 px-4 text-center">
          <div className="inline-block rounded-full bg-claude-accent/10 px-3 py-1 text-sm text-claude-accent">
            🌟 Mathias returns!
          </div>
        </div>
        
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
                    <span className="text-white font-semibold text-sm">C</span>
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
      
      <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
    </div>
  );
};

export default ChatContainer;
