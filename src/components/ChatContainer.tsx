
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage, { MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newUserMessage]);
    
    // Simulate Claude's response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that. Let's explore some solutions together.",
        "That's an interesting question. Here's what I think...",
        "I understand what you're asking. Based on my knowledge, I can tell you that...",
        "Thanks for sharing that with me. I have a few thoughts on this topic.",
        "I can definitely help you with this request. Let me provide some information."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
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
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
